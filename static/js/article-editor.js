$('textarea').autosize();


function categoryCount(){
    return parseInt($('#number-of-categories').val());
}

function increaseCategory(){
    $('#number-of-categories').val( categoryCount()+1);
}

function decreaseCategory(){
    $('#number-of-categories').val(categoryCount()-1);
}

$('#bu-remove-category').click(function () {
    var category_count = categoryCount();
    if (category_count > 0){
        if (category_count === 1){$('#bu-remove-category').css('visibility','hidden');}
        $('#category-' + category_count).remove();
        $('#category_' +category_count +'_chzn').remove();

        decreaseCategory();
    }
    return false;
});
$('#bu-add-category').click(function () {
    var new_category_num = categoryCount() + 1;
    if (new_category_num === 1){
        $('#bu-remove-category').css('visibility','visible');
    }


    $('#bu-remove-category').after($('#category-placeholder').first().clone(false).attr('id','category-' + new_category_num).show());
    $('#category-' + new_category_num).chosen();
    increaseCategory();

    return false;

});
