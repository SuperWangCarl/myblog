---
layout: page
title: Spring Boot 系列文章
titlebar: springboot
subtitle: <span class="mega-octicon octicon-cloud-download"></span>&nbsp;&nbsp;
menu: java
css: ['blog-page.min.css']
permalink: /springboot.html
keywords: Spring Boot 教程,Spring Boot 示例,Spring Boot 学习,Spring Boot 资源,Spring Boot 2.0
---

<div class="row">

    <div class="col-md-12">

        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='springboot' or post.keywords contains 'springboot' %}
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