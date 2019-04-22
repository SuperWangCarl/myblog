---
layout: page
title: 搭建属于我们自己的博客
titlebar: myblog
subtitle: <span class="mega-octicon octicon-clippy"></span>&nbsp;&nbsp; 作为一个程序猿 怎能没有一个自己的门面
menu: all
css: ['blog-page.min.css']
permalink: /myblog.html
keywords: myblog
---

<div class="row">

    <div class="col-md-12">

        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='myblog' or post.keywords contains 'myblog' %}
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