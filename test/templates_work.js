/*
<script type="text/javascript" src="js/handlebars-v4.0.5.js"></script>


*/
<script id="entry-template" type="text/x-handlebars-template">


  <article class="post">
    <h3>{{title}}</h3>
    <h5>{{date}}</h5>
    <section>{{content}}</secton>
    <tags>{{#tags}}.{{/tags}}</tags>
  </article>

</script>

<script>
$(document).ready(function() {



	var source = $("#entry-template").html();
	var template = Handlebars.compile(source);
	
	var object = {}

	$.extent(object{}, array from get[]);



	var html = template(object);
	*/
});
</script>
