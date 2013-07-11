if (skinTesting() ||
    _path_name.match(/^\/article\//)) {

    $('textarea').autosize();

    function pageArticleLink() {
        return _path_name.substring(_path_name.lastIndexOf('/') + 1);
    }

    function evLoadComments() {
        $('.loading.comments').show();
        if (true) {
            setTimeout(function () {
                var comments = {comments: [
                    {

                        comment_id: "ergeeporkgr",
                        name: 'George Carlin',
                        content: "By default, images are presented at 80px by 80px if no size parameter is supplied. You may request a specific image size, which will be dynamically delivered from Gravatar by using the s= or size= parameter and passing a single pixel dimension (since the images are square):",
                        img: "http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=70",
                        website: "www.com",
                        created: cur_timestamp(),
                        replies: [
                            {
                                comment_id: "ergrhtredfhrter",
                                name: 'Relfor',
                                relfor: true,
                                content: "???",
                                img: "http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=70",
                                website: "",
                                created: cur_timestamp()
                            },
                            {
                                comment_id: "ergrhtredfhrter",
                                content: "eeklgmerlger",
                                name: 'George Carlin',
                                img: "http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=70",
                                website: "",
                                created: cur_timestamp()
                            }

                        ]
                    }

                ]};
                perfLoadComments(comments);

            }, 100);
        }

        else {
            go_ajax(_path_name + '/_comments', 'GET', perfLoadComments, {'error': function () {
                return $('.loading.comments').removeClass('comments').show().html(span('Error Retrieving Comments',
                    {'class': 'color'}).outerHTML);


            }});
        }
    }

    function perfLoadComments(dict) {
        console.log(dict);
        if (dict.error) {
            return $('.loading.comments').after(
                div('Error Retrieving Comments', {'class': 'color', style: 'font-size:20px; margin-bottom:25px'})).hide();
        }

        $('.loading').hide();

        var comments = dict.comments;
        if (comments) {
            var comment_replies;
            var comments_list = $('#comments-section').children('ul');
            for (var i = comments.length - 1; i >= 0; i--) {
                comment_replies = [];
                for (var j = 0; j < comments[i].replies.length; j++) {
                    comment_replies.push(comment(comments[i].replies[j], {reply:true}));
                }
                comments_list.append(comment(comments[i], {'children':comment_replies}));

            }
        }
    }

    evLoadComments();


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
        dict.parent_comment_id = "";
        if (true) {
            dict.created = cur_timestamp();
            dict.img = 'http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=70';
            dict.comment_id = Math.ceil(Math.random() * 100);
            perfPostComment(dict);
        } else {
            go_ajax(_path_name + '/_comments', 'POST', dict, function (ret_dict) {
                ret_dict.created = cur_timestamp();
                ret_dict.content = dict.content;
                ret_dict.name = dict.name;
                ret_dict.website = dict.website;
                perfPostComment(ret_dict);
            })
        }

    });


    function perfPostComment(dict) {
        if (dict.error) {
            return pop(dict.error, 'error');
        }


        $('html, body').animate({
            scrollTop: $("#comments-section").offset().top
        }, 200);

        $('#comments-section').children('ul').prepend(comment(dict, {'children': []}));

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
            go_ajax(_path_name + '/_comments', 'POST', dict, function (ret_dict) {
                console.log(dict);
                ret_dict.parent_comment_id = dict.parent_comment_id;
                ret_dict.created = cur_timestamp();
                ret_dict.content = dict.content;
                ret_dict.name = dict.name;
                ret_dict.website = dict.website;
                perfReplyComment(ret_dict);
            })
        }
    }


    function comment(dict, options) {
        options = options ? options : {};
        return li({'class': 'cf slide-left', 'data-comment-id': dict.comment_id}, [
            img({src: dict.img, height: 70, width: 70}),
            div(dict.content),
            div({'class': 'comment-meta'}, [
                dict.relfor ? span(dict.name, { 'class': 'color'}) :
                    (dict.website ? a(dict.name, {'href': dict.website, 'class': 'hover-link'}) : span(dict.name)), br(),
                span({'data-timestamp': dict.created, 'data-time-mode': '2'}), br(),
                options.children ?  button({'class': 'bu-form-reply-comment', 'click': buFormReplyComment}) : null
            ]),
            options.children ? ul(options.children) : null
        ])
    }

    function perfReplyComment(dict) {

        if (dict.error) {
            return pop(dict.error, 'error');
        }
        var $parent_comment = $('[data-comment-id=' + dict.parent_comment_id + ']');

        $parent_comment.find('ul').append(comment(dict));


        $parent_comment.find('.comment-form').remove();
        $parent_comment.find('.bu-form-reply-comment').prop('disabled', false);
        pop(p({html: 'Your comment has been posted as of now, however confirmation is <b><i>required</i></b>.<br><br>' +
            'Please check your inbox for the confirmation mail; click on the link given in the email (this link lasts 2 hours)<br><br>' +
            'If this confirmation is not performed, your comment will be <b><i>deleted</i></b> in 2 hours.'}), 'slide');

    }
}