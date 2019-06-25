---
layout: page
title: 安全认证相关
titlebar: safe
subtitle: <span class="mega-octicon octicon-clippy"></span>&nbsp;&nbsp; 安全认证相关
menu: all
css: ['blog-page.min.css']
permalink: /safe.html
keywords: safe
---

<div class="row">

    <div class="col-md-12">

        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='safe' or post.keywords contains 'safe' or post.keywords contains 'safe' or post.category=='sso'%}
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