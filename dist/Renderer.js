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
        let con = $(`#${elemID}`).closest('.song').html()
        let t =  $(`#${elemID}`).closest('.song')
        // $(`#${elemID}`).closest('.song').html("")
        // t.html(con)
        let src  = t.attr(src);
        let id = t.attr("i")
        // $(`#${elemID}`).closest('.song').append(`#${elemID}`)

        // var container = $('.song')
        // var content = container.innerHTML;
        // container.innerHTML= content; 
    }
}