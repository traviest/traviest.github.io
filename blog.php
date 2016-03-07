<?php 
	// pull php functions
	nclude 'php/functions.php';
	// load xml file and create object
	$xml = simplexml_load_file("posts/posts.xml") or die("Error: Cannot create posts object");
	
	
	
	// use url strings to pull post info (with a post id number?)
	// use post number to put post title as page title
	// use post number to display specific post page vs full blog


?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8"/>
	<meta name="keywords" content="traviest, designer, portfolio, thoughts, rambles, rants" />
	<meta name="description" content="" />
	<title>Traviest | Blog</title>
	
	<link rel="icon" href="images/favicon.png" type="image/x-icon" />
	<link rel="apple-touch-icon" href="images/appleicon.png" />
	<link rel="stylesheet" href="css/styles.css" />
	<link rel="stylesheet" href="css/blog.css"/>
		
	<script src="js/jquery.js" type="text/javascript"></script>
	<script src="js/main.js" type="text/javascript"></script>
</head>
<body>
<header>
	<article><a href="index.html"></a></article>
	<ul id="lineNav">
		<li><a href="index.html">Home</a></li>
		<li class="current"><a href="blog.php">Blog</a></li>
		<li><a href="about.html">About</a></li>
		<li><a href="portfolio.html">Portfolio</a></li>
	</ul>
</header>

<section id="content">
	<section id="sidebar">
	
		<h5>Links</h5>
		<ol id="sidebar_posts">
			<li><a href="" class="hvr_underline_from_center small">Link Text</a></li>
			<li><a href="" class="hvr_underline_from_center small">Link Text</a></li>
			<li><a href="" class="hvr_underline_from_center small">Link Text</a></li>
			<li><a href="" class="hvr_underline_from_center small">Link Text</a></li>
			<li><a href="" class="hvr_underline_from_center small">Links</a></li>
		</ol>
		
		<h5>Tags</h5>
		<ol id="sidebar_tags">
			<li>Tag</li>
			<li>Tag</li>
			<li>Tag</li>
		</ol>
		
		<a href="#" id="to_the_top">
			<img src="images/topper.png" />
		</a>
		
	</section><!-- end sidebar -->
	
	<section id="main">
		<h4>Blog</h4>
		<?php
						
			foreach ($xml as $posts) {
				
				$postinfo = "<article>\n"
					."\t\t\t<h5>{$posts->title}</h5>\n"
					."\t\t\t<h6>{$posts->date}</h6>\n"
					."\t\t\t<section>{$posts->content}</section>\n";
				
				$posttags = split(',',$posts->tags);
				
				$postinfo .= "\t\t\t<ul>\n";
				foreach ($posttags as $tags) {
					$postinfo .= "\t\t\t\t<li>{$tags}</li>\n";
				}
				
				$postinfo .= "\t\t\t</ul>\n\t\t</article>\n";
				
				printf($postinfo);
			}
		?>
		

	 	
	</section><!-- end main -->
	
</section><!-- end content -->

<footer>
	<?php
		echo "<h6>Travis Leonard &copy; 2015-".date("Y")."</h6>";
	?>
</footer>
	
</body></html><!-- end page -->