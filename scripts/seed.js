#!/usr/bin/env node

'use strict';

var _         = require('lodash');
var Promise   = require('bluebird');
var container = require('../src/containerFactory').createContainer();
var neo4j     = container.get('neo4j');

var careers   = require('./info/careers');
var courses   = require('./info/courses');

Promise.resolve()

  // Clear all relations
  .then(() => neo4j.run('MATCH (a)-[c]->(b) DELETE c'))
  // Clear all nodes
  .then(() => neo4j.run('MATCH (a) DELETE a'))

  // Create constraints
  .then(() => neo4j.run('CREATE CONSTRAINT ON (career:Career) ASSERT career.code IS UNIQUE'))
  .then(() => neo4j.run('CREATE CONSTRAINT ON (course:Course) ASSERT course.code IS UNIQUE'))

  // Insert all careers
  .return(careers)
  .map(career => neo4j.run('CREATE (c: Career { name: {name}, code: {code} })', career))
  .then(() => console.log(`Done ${careers.length} careers.`))

  // Insert all courses
  .return(courses)
  .map(course => Promise.resolve()
    .then(() => neo4j.run(
      'MERGE (course: Course { name: {courseName}, code: {courseCode} });', {
        courseName: course.name,
        courseCode: course.code
      }
    ))

    // and their relations with careers
    .return(course.presentIn)
    .map(presentIn => neo4j.run(`
      MATCH (career: Career { code: {careerCode} })
      MATCH (course: Course { code: {courseCode} })
      CREATE (course)-[:PRESENT_IN {
        year:     {year},
        hours:    {hours},
        duration: {duration},
        optative: {optative},
        main:     {main}
      }]->(career);`, {
        courseCode: course.code,
        careerCode: presentIn.careerCode,
        duration:   presentIn.duration,
        hours:      presentIn.hours,
        main:       presentIn.main,
        optative:   presentIn.optative,
        year:       presentIn.year
      })
    )

    // and their dependencies
    .return(course.dependsOn)
    .map(dependenceCode => neo4j.run(`
      MATCH (course1: Course { code: {courseCode1}})
      MATCH (course2: Course { code: {courseCode2}})
      CREATE (course1)-[:DEPENDS_ON]->(course2);
    `, {
      courseCode1: course.code,
      courseCode2: dependenceCode
    }))
  )
  .then(() => console.log(`Done ${courses.length} courses.`))

  .then(() => {
    console.log('OK');
    process.exit(0);
  })
  .catch(error => {
    console.log('ER', error);
    console.log(error.stack);
    process.exit(1);
  })
;

// 
// %dw 1.0
// %input payload application/csv
// %output application/json
// ---
// payload groupBy $.codigo map {
//   code: $.codigo[0],
//   name: $.name[0],
//   presentIn: $ groupBy $.career pluck {
//     careerCode: $$,
//     hours: $.horas[0],
//     year: $.year[0],
//     duration: $.duration[0],
//     optative: $.optative[0] == "1",
//     main: $.main[0] == "1"
//   },
//   dependsOn: []
// }
