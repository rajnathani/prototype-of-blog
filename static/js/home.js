if (_path_name.match(/^\/?$/) || _path_name.match(/home\.html$/)) {
    function evCheckHomeScroll() {
        if ($(document).height() - ($(this).scrollTop() + $(window).height()) < 200) {
            var $last_link = $('.article').last();
            var last_link = $last_link.attr('data-link');
            var last_link_ts = parseInt($last_link.find('.article-meta [data-timestamp]').attr('data-timestamp'));
            $(window).unbind('scroll', evCheckHomeScroll);
            $('.loading').show();
            if (true) {
                setTimeout(function () {
                    $('.loading').hide();
                    if (last_link !== 'foo-bar-last') {
                        console.error('Infinite Scroll last element incorrect');
                    }

                    $(window).bind('scroll', evCheckHomeScroll);
                    perfAppendMoreArticles({ more_articles: [
                        {   'link': 'foo-bar-last',
                            'title': 'Bar baz',
                            'content': "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                            'created': 1369692766,
                            'categories': ['Alpha', 'Beta', 'Gamma']
                        }
                    ]});
                }, 1000);
            } else {
                go_ajax('/_?last_link=' + last_link + '&timestamp=' + last_link_ts, 'GET', perfAppendMoreArticles,
                    {'complete': function (jqXHR, text_status) {
                        $('.loading').hide();
                        if (["notmodified", "error", "timeout", "abort", "parsererror"].indexOf(text_status) !== -1) {
                            $(window).bind('scroll', evCheckHomeScroll);
                        }
                    }});
            }


        }

    }

    $(window).bind('scroll', evCheckHomeScroll);


    function perfAppendMoreArticles(dict) {

        if (!dict.error && dict.more_articles) {
            if (dict.more_articles.length === 0) {
                // The return statement below is important. the function needs to terminate
                // here as later in the function we re-bind the scrolling event to the window,
                // which we obviously do not want any more.
                return $('#articles').after(div({'class': 'gab', style: 'margin:30px 0;font-size:25px; text-align:center;'}, "~ THE END ~"));
            }
            var cur_article, cur_article_categories, cur_category;

            for (var i = 0; i < dict.more_articles.length; i++) {
                cur_article = dict.more_articles[i];

                cur_article_categories = div({'class': 'categories'});

                for (var j = 0; j < cur_article.categories.length; j++) {
                    cur_category = cur_article.categories[j];
                    cur_article_categories.appendChild(a(cur_category, {href: '/category/' + cur_category, 'class': 'hover-link'}))
                }
                $('#articles').append(
                    li({'class': 'article cf', 'data-link': cur_article._id}, [
                        div([
                            h1({'class': 'article-head'}, [
                                a(cur_article.title, {href: '/article/' + cur_article._id, 'class': 'hover-link'})
                            ]),
                            div(cur_article.content, {'class': 'article-content'})
                        ]),
                        div({'class': 'article-meta'}, [
                            div({'data-timestamp': cur_article.created, 'data-time-mode': "1"}),
                            cur_article_categories
                        ])
                    ])

                );

            }
        }
        $(window).bind('scroll', evCheckHomeScroll);
    }
}
