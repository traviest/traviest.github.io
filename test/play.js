$(document).ready(function() {
    // ADDS TO-DO LIST LINK TO ALL PAGES
    /*
  var cur_page = window.location.pathname.split("/").pop().split(".")[0],
      todoTitle = $('<a>').addClass('swinger')
        .html('<i class="ion-ios-list-outline"></i>To-Do List');
  if (cur_page=='tags' || cur_page=='categories' || cur_page=='archives')
    todoTitle.attr('href', '../lab.html#todo_list');
  else
    todoTitle.attr('href', 'lab.html#todo_list');
    */
  var todoTitle = $('<a>').addClass('swinger')
        .attr('href', '../lab.html#todo_list')
        .html('<i class="ion-ios-list-outline"></i>To-Do List'),
      todoList = $('<div>').addClass('todo_link').append(todoTitle);
  $(todoList).appendTo('header');

  var todoTimer = setTimeout(function() { hideTodo() }, 60*1000);
  function hideTodo() {
    $('.todo_link').slideUp('300');
  }/*
  $(window).scroll(function() {
      if ($(window).scrollTop() > 500) {
        $('.todo_link').slideUp(100);
      }
      if ($(window).scrollTop() < 300) {
        $('.todo_link').slideDown(100);
        clearTimeout(todoTimer);
        todoTimer = setTimeout(function() { hideTodo() }, 60*1000);
      }
  });
  */
});
