---
layout: page
title: 软件分享
titlebar: utils
subtitle: <span class="mega-octicon octicon-clippy"></span>&nbsp;&nbsp; 一些娱乐类的软件分享
menu: all
css: ['blog-page.min.css']
permalink: /software-share.html
keywords: software-share
---

<div class="row">

    <div class="col-md-12">

        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='utils' or post.keywords contains 'utils' or post.keywords contains 'utils' %}
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