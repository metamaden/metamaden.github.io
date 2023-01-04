---
layout: default
title: Home
---

# About Sean

Sean Maden, PhD, is a remote-working postodoctoral research fellow in the Department of Biostatistics at Johns Hopkins Bloomberg School of Public Health, advised by Prof. Stephanie Hicks. 

Sean possesses over 8 years of experience in bioinformatics research and programming. As part of his doctoral work in Computational Biology, Sean published the [recountmethylation](http://www.bioconductor.org/packages/release/bioc/html/recountmethylation.html) Bioconductor package and affiliated public data compilations and workflow.

Sean lives near Portland, OR with his fiancee Lindsay Dawson. In his free time, he enjoys making and consuming espresso concoctions, hikes, sci-fi and nonfiction books, and strategy games.

<center>
<img src="/images/snl-index-pic.PNG" width="50%" align="center" />
</center>

# Latest blog posts

<ul>
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url }}">({{ post.date | date_to_string }}) {{ post.title }}</a></h2>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>

# GitHub commit history
<center>
<img src="https://ghchart.rshah.org/4b0082/metamaden" alt="Sean's recent GitHub commit history" width="80%">
</center>
