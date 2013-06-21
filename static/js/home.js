if (_path_name.match(/\/?/) || _path_name.match(/home\.html$/)) {

    function evCheckHomeScroll() {
        if ($(document).height() - ($(this).scrollTop() + $(window).height()) < 200) {
            var last_link = $('.article').last().attr('data-link');
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
                go_ajax('/_', 'GET', {last_link: last_link}, perfAppendMoreArticles,
                    {'complete': function () {
                        $('.loading').hide();
                        $('window').bind('scroll', evCheckHomeScroll);
                    }});
            }


        }

    }

    $(window).bind('scroll', evCheckHomeScroll);


    function perfAppendMoreArticles(dict) {

        if (!dict.error && dict.more_articles) {
            if (dict.more_articles.length === 0){
                $(window).unbind('scroll', evCheckHomeScroll);
                $('#articles').after(div({'class':'gab', style:'margin:30px 0;font-size:25px; text-align:center;'}, "~ THE END ~"))
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
                    li({'class': 'article cf', 'data-link': cur_article.link}, [
                        div([
                            h1({'class': 'article-head'}, [
                                a(cur_article.title, {href: '/article/' + cur_article.link, 'class': 'hover-link'})
                            ]),
                            div(cur_article.content, {'class': 'article-content'}),
                        ]),
                        div({'class': 'article-meta'}, [
                            div({'data-timestamp': cur_article.created, 'data-time-mode': "1"}),
                            cur_article_categories
                        ])
                    ])

                );

            }
            /*<li class="article cf" data-link="foo-bar">
             <div>

             <h1 class="article-head"><a href="article.html" class="hover-link">Lorem Ipsum is simply dummy text of the printing and
             typesetting industry</a></h1>

             <div class="article-content">So let's begin: Lorem Ipsum is simply dummy text of the printing and
             typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the
             1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen
             book. It has survived not only five centuries, but also the leap into electronic typesetting,
             remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
             sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
             Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the
             printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
             since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
             specimen book. It has survived not only five centuries, but also the leap into electronic
             typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
             of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
             software like Aldus PageMaker including versions of Lorem Ipsum.
             </div>
             </div>
             <div class="article-meta">
             <div data-timestamp="1369692766" data-time-mode="1"></div>
             <div class="categories">
             <a href="category.html" class="hover-link">User Experience</a>
             <a href="category.html" class="hover-link">Start Ups</a>
             </div>
             </div>
             </li>*/
        }
    }
}
