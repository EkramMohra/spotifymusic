class Renderer {
    constructor() {}

    render(sourceSong) {
        $('.container').empty();
        
        const source = $("#songs-template").html()
        const template = Handlebars.compile(source)
        const newHTML = template({sourceSong})
        $('.container').append(newHTML)
    }
}