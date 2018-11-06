$(document).ready(function(){
    $.ajax({
        url: 'https://api.vk.com/method/photos.get?owner_id=-171834232&album_id=256701104&count=30&v=5.85&extended=1&access_token=eef875aceef875aceef875ac7dee9e39c4eeef8eef875acb55397d9d114d1d6df55ee23&expires_in=0',
        type: 'GET',
        dataType: 'jsonp',
    })
    .done(function(data) {
        var content = "";
        data.response.items.forEach(element => {
            $('#protfolio-container').append("<a download href='"+ element.sizes[6].url +"' data-lightbox='roadtrip'><img class='item' src='" + element.sizes[8].url + "' title='" + element.likes.count +" likes'></a>");
    });
    });
setTimeout(init, 300);
});

function init(){
    $('#protfolio-container').masonry({
        itemSelector: '.item',
        //columnWidth: 100
    });
}