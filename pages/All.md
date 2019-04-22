---
layout: page
title: All articles are here
titlebar: archives
subtitle: <span class="mega-octicon octicon-calendar"></span> 所有的文章都在这里哦
menu: all
css: ['blog-page.min.css']
permalink: /all.html
---
<div style="display:inline-block">
<ul class="archives-list">
  {% for post in site.posts %}

    {% unless post.next %}
      <h3>{{ post.date | date: '%Y' }}</h3>
    {% else %}
      {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
      {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
      {% if year != nyear %}
        <h3>{{ post.date | date: '%Y' }}</h3>
      {% endif %}
    {% endunless %}

    <li><span>{{ post.date | date:'%m-%d' }}</span> <a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
</div>