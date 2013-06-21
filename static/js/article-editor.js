if (skinTesting() ||
    _path_name.match(/write\-article$/) ||
    _path_name.match(/\/edit$/)
    ) {
    $('textarea').autosize();

    $('.default-category-select').chosen();


    $('.article-content').keyup(function (e) {


        if (e.keyCode === 16) {
            $.data(this,'shift-pressed', false);
        }
    });

    //thanks: http://jsfiddle.net/sdDVf/8/
    $('.article-content').keydown(function (e) {


        if (e.keyCode === 16) {
            $.data(this, 'shift-pressed', true);
        }
        if (e.keyCode === 9) {

            if ($.data(this, 'shift-pressed')) {
                var to_find = "\n\t";
                var to_replace = "\n";
            } else {
                var to_find = "\n";
                var to_replace = "\n\t";

            }
            var start_pos = this.selectionStart;
            var end_pos = this.selectionEnd;


            var $this = $(this);
            var selected_text = $this.val().substring(start_pos, end_pos);
            var before_selected_text = $this.val().substring(0, start_pos);
            if (before_selected_text.match(new RegExp(to_find))) {
                var last_index_line_break = before_selected_text.lastIndexOf(to_find);
                before_selected_text = before_selected_text.substring(0, last_index_line_break) + to_replace +
                    before_selected_text.substring(last_index_line_break + to_find.length);
            }
            else {
                if (to_replace === "\n\t") {
                    before_selected_text = "\t" + before_selected_text;
                }
            }

            selected_text = selected_text.replace(new RegExp(to_find, 'g'), to_replace);

            $this.val(before_selected_text + selected_text + $this.val().substring(end_pos));
            this.selectionStart = this.selectionEnd = start_pos + to_replace.length - to_find.length;
            this.selectionStart = start_pos;
            this.selectionEnd = end_pos;

            return false;
        }
    });

    function categoryCount() {
        return parseInt($('#number-of-categories').val());
    }

    function increaseCategory() {
        $('#number-of-categories').val(categoryCount() + 1);
    }

    function decreaseCategory() {
        $('#number-of-categories').val(categoryCount() - 1);
    }

    $('#bu-remove-category').click(function () {
        var category_count = categoryCount();
        if (category_count > 0) {
            if (category_count === 1) {
                $('#bu-remove-category').css('visibility', 'hidden');
            }
            $('#category-' + category_count).remove();
            $('#category_' + category_count + '_chzn').remove();

            decreaseCategory();
        }
        return false;
    });
    $('#bu-add-category').click(function () {
        var new_category_num = categoryCount() + 1;
        if (new_category_num === 1) {
            $('#bu-remove-category').css('visibility', 'visible');
        }


        $('#bu-remove-category').after($('#category-placeholder').first().clone(false).attr('id', 'category-' + new_category_num).show());
        $('#category-' + new_category_num).chosen();
        increaseCategory();

        return false;

    });


    $('#bu-preview-article').click(function () {
        var $this = $(this);
        if ($this.hasClass('color')) {
            $this.removeClass('color');
            $('#article-preview').hide();
            $('textarea.article-content').show();
        } else {
            $this.addClass('color');

            var $article_textarea = $('textarea.article-content');
            var $article_preview = $('#article-preview');

            $article_preview.html(markDown($article_textarea.val()));

            $article_textarea.hide();
            $article_preview.show();
        }
        return false;
    });

    function markDown(mark_down) {
        var converter = new Markdown.Converter();
        return (converter.makeHtml(mark_down));
    }


}