/*
  Author : Ivan Tikhonov
  Based On : FeedEk jQuery RSS/ATOM Feed Plugin v3.0 with YQL API (Engin KIZIL http://www.enginkizil.com)    
*/
var RssFeedsEx = (function () {
    function getFeedsByUrl (opt) {
        var def = $.extend({
            MaxCount: 1,
            ShowCategory: false,
            ShowDesc: false,
            ShowPubDate: true,
            ShowPicture: true,
            ShowAuthor: true,
            DescCharacterLimit: 0,
            DateFormat: "",
            DateFormatLang: "ru"
        }, opt);

        try {
            //<declaration>
            var posts = [];
            var id = $(def.Container).attr("id");
            //</declaration>

            if (def.FeedUrl == undefined) {
                showEmptyBlog(id);
                return;
            }

            //Yahoo! Query Language
            var yql = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + def.FeedUrl + '" LIMIT ' + def.MaxCount;

            $.ajax({
                url: "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yql) + "&format=json&diagnostics=false&callback=?",
                dataType: "json",
                success: function(data) {
                    $("#" + id).empty();

                    if (data.query.results == null) {
                        showEmptyBlog(id);
                        return;
                    }

                    if (!(data.query.results.rss instanceof Array)) {
                        data.query.results.rss = [data.query.results.rss];
                    }

                    $.each(data.query.results.rss, function(e, item) {

                        var post = new Post();

                        //<picture>
                        if (def.ShowPicture) {
                            post.picture = prepareImgTag(item.channel.item.description);
                        }
                        //</picture>

                        //</category>
                        if (def.ShowCategory) {
                            post.category = item.channel.item.category[0];
                        }
                        //</category>

                        //<title>
                        post.title = item.channel.item.title;
                        //</title>

                        //<description>
                        if (def.ShowDesc) {
                            if (def.DescCharacterLimit > 0 && item.channel.item.description.length > def.DescCharacterLimit) {
                                post.description = item.channel.item.description.substring(0, def.DescCharacterLimit) + "...";
                            } else {
                                post.description = item.channel.item.description;
                            }
                        }
                        //</description>

                        //<link>
                        post.link = item.channel.item.link;
                        //</link>

                        //<date>
                        if (def.ShowPubDate) {
                            post.date = prepareDate(item.channel.item.pubDate, def.DateFormatLang);
                        }
                        //</date>

                        //<author>
                        if (def.ShowAuthor) {
                            post.author = item.channel.item.creator;
                        }
                        //</author>

                        posts.push({ 'category': post.category, 'title': post.title, 'description': post.description, 'link': post.link, 'picture': post.picture, 'date': post.date, 'author': post.author });
                        //return posts;                   
                    });

                    var feedsHtml = buildFeedsHtml(posts);
                    $("#" + id).append('<div class="feedsList">' + feedsHtml + '</div>');

                }
            });
        } catch (e) {
            showEmptyBlog(id);
            return;
        }
    };

    function Post(c, t, d, l, p, dt, a) {
        this.category = c;
        this.title = t;
        this.description = d;
        this.link = l;
        this.picture = p;
        this.date = dt;
        this.author = a;
    }

    function prepareImgTag(stringDescription) {
        var imgTag = stringDescription.match("<img.+?src=[\"'](.+?)[\"']>");
        if (imgTag != null)
            return imgTag[1].replace('"', '').split(" ")[0];
        else
            return "/_layouts/MyLanit.Socials/img/habr_empty.png";

    }

    function prepareDate(stringDate, lang) {
        var dt = new Date(stringDate);

        var options = {
            month: 'long',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric'
        };

        return dt.toLocaleString(lang, options).replace(',', " в");
    }

    function buildFeedsHtml(feeds) {
        var html = "";
        for (var i = 0; i < feeds.length; i++) {
            html += '<div class="feedsPost">';
            html += "<div id='habr-post-img' style='background: url(" + feeds[i].picture + ");'>";
            var longTitle = feeds[i].category + ' → ' + feeds[i].title;
            html += '<a href="' + feeds[i].link + '" target="_blank"><span>' + longTitle.substring(0, 50) + ' ...' + '</a>';
            html += '<ul class="pub-info"><li>' + feeds[i].date + '</li><li>@' + feeds[i].author + '</ul>';	
            html += '</div></div>';
        }
        return html;
    }

    function showEmptyBlog(id) {
        $(".socials__widget-item.habr .shadow").hide();
        $("#" + id).toggleClass("empty-blog");
        $("#" + id).html("Блога не существует или в нем нет публикаций");
    }

    return {
        returnFeedsByUrl: getFeedsByUrl
    };
})();
