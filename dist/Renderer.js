class Renderer {
    constructor() {}

    render(sourceSong, target) {
        $(target).empty()
        
        const source = $("#songs-template").html()
        const template = Handlebars.compile(source)
        const newHTML = template({sourceSong})
        $(target).append(newHTML)
    }
    singleRender(elemID){
        console.log(elemID);
        $(elemID).css("display","none")
        $(elemID).css("display","block")
    }
}