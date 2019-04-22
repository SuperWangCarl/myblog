---
layout: page
title: 这里分享关于 前端 的一切
titlebar: web
subtitle: <span class="mega-octicon octicon-clippy"></span>&nbsp;&nbsp; 前端 系列文章
menu: web
css: ['blog-page.min.css']
permalink: /web.html
keywords: web
---

<div class="row">

    <div class="col-md-12">

        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='web' or post.keywords contains 'web' or post.keywords contains 'jquery' or post.keywords contains 'react' or post.keywords contains 'vue' or post.keywords contains 'Vue'%}
                <li class="posts-list-item">
                    <div class="posts-content">
                        <span class="posts-list-meta">{{ post.date | date: "%Y-%m-%d" }}</span>
                        <a class="posts-list-name bubble-float-left" href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
                        <span class='circle'></span>
                    </div>
                </li>
                {% endif %}
            {% endfor %}
        </ul> 

        <!-- Pagination -->
        {% include pagination.html %}

    </div>

</div>
<script>
    $(document).ready(function(){

        // Enable bootstrap tooltip
        $("body").tooltip({ selector: '[data-toggle=tooltip]' });

    });
</script>