

if (skinTesting() || _path_name.match(/^\/about/)){

    var $top_level_lists = $('#tech-list li > span');
    $top_level_lists.next().hide();
    $top_level_lists.click(function(){
        $(this).next().slideToggle(100);
        $(this).parent().toggleClass('down');
    })
}