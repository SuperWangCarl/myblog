---
layout: page
title: devops
titlebar: devops
subtitle: <span class="mega-octicon octicon-clippy"></span>&nbsp;&nbsp; devops技术栈的使用
menu: all
css: ['blog-page.min.css']
permalink: /devops.html
keywords: devops
---

<div class="row">

    <div class="col-md-12">

        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='devops' or post.keywords contains 'git' or post.keywords contains 'jenkins' or post.keywords contains 'svn' or post.keywords contains 'docker'%}
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