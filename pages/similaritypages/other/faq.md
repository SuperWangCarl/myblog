---
layout: page
title: FAQ
titlebar: FAQ
subtitle: <span class="mega-octicon octicon-clippy"></span>&nbsp;&nbsp; 总结些平常工作中的错误
menu: all
css: ['blog-page.min.css']
permalink: /faq.html
keywords: FAQ
---

<div class="row">

    <div class="col-md-12">

        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='FAQ' or post.keywords contains 'faq' or post.keywords contains 'FAQ' %}
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