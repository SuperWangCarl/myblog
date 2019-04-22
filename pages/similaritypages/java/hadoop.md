---
layout: page
title: 大数据 系列文章
titlebar: springcloud
subtitle: <span class="mega-octicon octicon-cloud-upload"></span>&nbsp;&nbsp;
menu: java
css: ['blog-page.min.css']
permalink: /hadoop.html
keywords: hadoop 教程,hadoop 示例,hadoop 学习,hadoop 资源,hadoop,大数据
---

<div class="row">

    <div class="col-md-12">

        <!-- Blog list -->
        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='hadoop' or post.keywords contains 'hadoop' or post.keywords contains 'Hadoop'%}
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