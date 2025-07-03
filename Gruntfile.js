module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            "options": { "separator": ";" },
            "build": {
                "src": ["src/js/main.js", "src/js/gsap.js", "src/js/swiper.js"],
                "dest": "src/js/bundle.js"
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat']);
};