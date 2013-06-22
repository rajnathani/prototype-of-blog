if (skinTesting() ||
    _path_name.match(/\/article\//)) {
    $('#comment-content').autosize();


    function pageArticleLink() {
        return $('#page-article-link').val();
    }

    function findCommentFormDetails($comment_form) {
        return {content: $comment_form.find('textarea').val(),
            name: $comment_form.find('input[type="text"]').val(),
            website: $comment_form.find('input[type="url"]').val(),
            email: $comment_form.find('input[type="email"]').val()
        };
    }

    function deleteCommentFormDetails($comment_form) {
        $comment_form.find('textarea').val("");
        $comment_form.find('input[type="text"]').val("");
        $comment_form.find('input[type="url"]').val("");
        $comment_form.find('input[type="email"]').val("")
    }


    function commentFormValidate(dict) {
        if (dict.content === '') {
            return false;
        }
        if (dict.name === '') {
            return pop('Please fill out your name.', 'error');
        } else if (dict.email === '') {
            return pop('Please fill out your email address.', 'error');
        } else if (!validEmail(dict.email)) {
            return pop('Please enter a valid email, confirmation will be required.', 'error');
        }
        return true;
    }

    $('#bu-post-comment').click(function () {
        var dict = findCommentFormDetails($('#leave-comment'));
        if (!commentFormValidate(dict)) {
            return false;
        }
        if (true) {
            dict.created = cur_timestamp();
            dict.img = 'http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=70';
            dict.comment_id = Math.ceil(Math.random() * 100);
            perfPostComment(dict);
        } else {
            go_ajax('/_article/' + pageArticleLink() + '/comment', 'POST', dict)
        }

    });

    function perfPostComment(dict) {
        if (dict.error) {
            return pop(dict.error, 'error');
        }

        var name = dict.website ? a(dict.name, {'href': dict.website, 'class': 'hover-link'}) : span(dict.name);

        $('html, body').animate({
            scrollTop: $("#comments-section").offset().top
        }, 200);

        $('#comments-section').children('ul').prepend(
            li({'class': 'cf slide-left', 'data-comment-id': dict.comment_id}, [
                img({src: dict.img}),
                div(dict.content),
                div({'class': 'comment-meta'}, [
                    name, br(),
                    span({'data-timestamp': dict.created, 'data-time-mode': '2'}), br(),
                    button({'class': 'bu-form-reply-comment', 'click': buFormReplyComment})
                ]),
                ul()
            ])
        );

        deleteCommentFormDetails($('#leave-comment'));
        pop(p({html: 'Your comment has been posted as of now, however confirmation is <b><i>required</i></b>.<br><br>' +
            'Please check your inbox for the confirmation mail; click on the link given in the email (this link lasts 2 hours)<br><br>' +
            'If this confirmation is not performed, your comment will be <b><i>deleted</i></b> in 2 hours.'}), 'slide');

    }


    function buFormReplyComment() {
        var $this = $(this);
        $this.prop('disabled', true);
        var $parent_coment = $this.closest('li');
        $parent_coment.append(
            div({'class': "cf comment-form"}, [
                div({'class': 'non-comment-details cf'}, [
                    input({'type': 'text', 'placeholder': 'Full Name', maxlength: '100'}),
                    input({'type': 'email', 'placeholder': 'Email Address', maxlength: '255'}),
                    input({'type': 'url', 'placeholder': 'Website/Blog (Optional)', maxlength: '100'})
                ]),
                textarea({'placeholder': 'Reply...', maxlength: "1000", 'rows': 2, 'focus': function () {
                    $(this).autosize()
                }}),
                button({'class': 'bu-reply-comment', 'click': buReplyComment}, 'Post'),
                button({'class': 'bu-cancel-reply', 'click': buCancelReply}, 'Cancel')
            ])
        );
        $('html, body').animate({
            scrollTop: ($parent_coment.find('.comment-form').offset().top - 190)
        }, 450);

        $parent_coment.find('input[type="text"]').focus();
    }

    $('.bu-form-reply-comment').click(buFormReplyComment);


    function buCancelReply() {
        var $parent_comment = $(this).closest('li');
        $parent_comment.find('.bu-form-reply-comment').prop('disabled', false);
        $parent_comment.find('.comment-form').remove();
    }

    function buReplyComment() {

        var dict = findCommentFormDetails($(this).closest('li').find('.comment-form'));
        if (!commentFormValidate(dict)) {
            return false;
        }
        dict.parent_comment_id = parseInt($(this).closest('li').attr('data-comment-id'));


        if (true) {
            dict.created = cur_timestamp();
            dict.img = 'http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=70';
            dict.comment_id = Math.ceil(Math.random() * 100);
            perfReplyComment(dict)
        } else {
            go_ajax('/_article/' + pageArticleLink() + '/comment', 'POST', dict, perfReplyComment)
        }
    }

    function perfReplyComment(dict) {
        if (dict.error) {
            return pop(dict.error, 'error');
        }

        var name = dict.website ? a(dict.name, {'href': dict.website, 'class': 'hover-link'}) : span(dict.name);

        var $parent_comment = $('[data-comment-id=' + dict.parent_comment_id + ']');
        $parent_comment.find('ul').append(
            li({'class': 'cf slide-left', 'data-comment-id': dict.comment_id}, [
                img({src: dict.img}),
                div(dict.content),
                div({'class': 'comment-meta'}, [
                    name, br(),
                    span({'data-timestamp': dict.created, 'data-time-mode': '2'})
                ])
            ])
        );

        $parent_comment.find('.comment-form').remove();
        $parent_comment.find('.bu-form-reply-comment').prop('disabled', false);
        pop(p({html:'Your comment has been posted as of now, however confirmation is <b><i>required</i></b>.<br><br>' +
            'Please check your inbox for the confirmation mail; click on the link given in the email (this link lasts 2 hours)<br><br>' +
            'If this confirmation is not performed, your comment will be <b><i>deleted</i></b> in 2 hours.'}), 'slide');

    }
}