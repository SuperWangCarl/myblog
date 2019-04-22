---
layout: page
title: Language 系列文章
titlebar: Language
subtitle: <span class="mega-octicon octicon-clippy"></span>&nbsp;&nbsp; 其他语言的学习文章
menu: language
css: ['blog-page.min.css']
permalink: /language.html
keywords: Language
---

<div class="row">

    <div class="col-md-12">

        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='Language'  or post.keywords contains 'language' or post.keywords contains 'language'  or post.keywords contains 'python'  or post.keywords contains 'Python'  or post.keywords contains 'Bat' or post.keywords contains 'Scala'  or post.keywords contains 'scala' %}
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