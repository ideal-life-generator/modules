module.exports = (grunt) ->

  grunt.loadNpmTasks "grunt-express-server"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-sass"

  grunt.config.init

    express:
      dev:
        options:
          script: "server.js"

    watch:
      express:
        files: "server.js"
        tasks: [ "express:dev" ]
        options:
          spawn: off
      scripts:
        files: [ "**/*.coffee", "!Gruntfile.coffee" ],
        tasks: [ "coffee:compile" ]
      styles:
        files: [ "**/*.sass" ]
        tasks: [ "sass:dist" ]

    coffee:
      compile:
        files: [
          expand: on
          cwd: "./"
          src: [ "**/*.coffee", "!Gruntfile.coffee" ]
          dest: "./"
          ext: ".js"
        ]

    sass:
      dist:
        options:
          sourcemap: "none"
        files: [
          expand: on
          cwd: "./"
          src: [ "**/*.sass" ]
          dest: "./"
          ext: ".css"
        ]