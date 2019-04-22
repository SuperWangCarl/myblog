---
layout: page
title: 这里分享关于 Java 的一切
titlebar: java
subtitle: <span class="mega-octicon octicon-clippy"></span>&nbsp;&nbsp; Java 系列文章
menu: java
css: ['blog-page.min.css']
permalink: /java.html
keywords: java
---

<div class="row">

    <div class="col-md-12">

        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='java' or post.keywords contains 'java' or post.keywords contains 'dubbo' or post.keywords contains 'jvm' or post.keywords contains 'spring' or post.keywords contains 'springboot' or post.keywords contains 'springcloud' or post.keywords contains 'hadoop'%}
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