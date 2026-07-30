$(document).ready(function(){
	// By default, all the divs are hidden, if you were to add a new div, you should hide it here.
	// If you want to show a div, you should clic on the corresponding link on the navbar.
	$('#educationContent').hide();
	$('#publicationsContent').hide();
	$('#experienceContent').hide();
	$('#presentationsContent').hide();
	$('#projectsContent').hide();
	$('#blogContent').hide();
	$('#postsContent').hide();
	$('#academicContent').hide();
	$('#particularContent').hide();
	// $('#photosContent').hide();

	// Options menu is hidden by default
	$('#theme').hide();

	// Handle 'About Me' content
	$('#aboutme').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#aboutmeContent');
		}

	});

	// Handle 'Education' content
	$('#education').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#educationContent');
		}
	});

	// Handle 'Publications' content
	$('#publications').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#publicationsContent');
		}
	});

	// Handle Writing & press content
	$('#blog').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#blogContent');
		}
	});

	// Handle 'Blog' (Markdown posts) content
	$('#posts').click(function(e) {

		// Prevent the href="#" default from clobbering the #/blog hash we set below.
		e.preventDefault();

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#postsContent');
		}

		// Render the post list (or honor a deep-linked post) via the blog router.
		if (window.Blog) {
			if (window.location.hash === '#/blog') Blog.applyRoute();
			else window.location.hash = '#/blog';
		}
	});

	// Handle teaching content
	$('#academic').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#academicContent');
		}
	});

	// Handle 'Particular' content
	$('#particular').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#particularContent');
		}
	});

	// Handle 'Presentations' content
	$('#presentations').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#presentationsContent');
		}
	});

	// Handle 'Experience' content
	$('#experience').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#experienceContent');
		}
	});

	// Handle 'Projects' content
	$('#projects').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#projectsContent');
		}
	});


	// Handle 'Photos' content
	// $('#photos').click(function(e) {

	// 	// If the div has already the class active, no need to reload the divs...
	// 	if(!$(e.target).hasClass('active')) {
	// 		// Update navbar
	// 		clearActiveLinks();
	// 		activateLink(e);

	// 		// Hide other contents
	// 		clearActiveDivs();

	// 		// Show current content
	// 		activateDiv('#photosContent');
	// 	}
	// });

	// **************************** //
	// Handles the Publications events
	// **************************** //

	// Copies the citation to the clipboard
	$(document).on("click", "#citation", function(){
		var text = $(this).parent().parent().next()[0].innerHTML;

		navigator.clipboard.writeText(text);

		toastr.success('Citation copied');
	});

	// ******************** //
	// Handles the Blog events
	// ******************** //

	// Opens the blog / press card target URL (hidden in .d-none) in a new tab
	$('.clickable').click(function(e) {
		var url = $(e.currentTarget).find('.d-none').first().text().trim();
		if (url.length > 0) {
			var w = window.open(url, '_blank');
			if (w) w.opener = null;
		}
	});


	// *************************** //
	// Handle the rest of the content
	// Omit this part if you don't have more content
	// *************************** //
	
	// If the user has not selected a theme, then select the default one according to the user's preferences
	if(localStorage.getItem("theme") === null){
		localStorage.theme = "light";
		if (window.matchMedia('(prefers-color-scheme: dark)').matches)
			localStorage.theme = "dark";
	}

	// Always load the light theme
	$('<link>').appendTo('head').attr({
		type: 'text/css', 
		rel: 'stylesheet',
		href: 'assets/css/light.css'
	});

	// If the user has the dark theme, then replace the light theme with the dark one
	if (localStorage.theme == "dark") {
		$("link[href='assets/css/light.css']").remove();
		$('<link>').appendTo('head').attr({
			type: 'text/css',
			rel: 'stylesheet',
			href: 'assets/css/dark.css'
		});
		$('#theme').empty().append("<i class='fa-duotone fa-lightbulb-slash'></i>");
		if (window.Blog) Blog.setHljsTheme(true);
	}

	// Controls the option menu toggler to show/hide the theme selector
	$('#options-toggler').click(function(e) {
		if(!$(e.currentTarget).hasClass('active')) {
			$(e.currentTarget).addClass('active');
			$('#theme').show("fast");
		}
		else {
			$(e.currentTarget).removeClass('active');
			$('#theme').hide("fast");
		}
	})

	// Alternates between light and dark themes
	$('#theme').click(function(e) {
		if(localStorage.theme != "dark"){
			$('#theme').empty().append("<i class='fa-duotone fa-lightbulb-slash'></i>");

			localStorage.theme = "dark"

			$("link[href='assets/css/light.css']").remove();
			$('<link>').appendTo('head').attr({
				type: 'text/css',
				rel: 'stylesheet',
				href: 'assets/css/dark.css'
			});
			if (window.Blog) Blog.setHljsTheme(true);
		}
		else {
			$('#theme').empty().append("<i class='fa-duotone fa-lightbulb'></i>");

			localStorage.theme = "light"

			$("link[href='assets/css/dark.css']").remove();
			$('<link>').appendTo('head').attr({
				type: 'text/css',
				rel: 'stylesheet',
				href: 'assets/css/light.css'
			});
			if (window.Blog) Blog.setHljsTheme(false);
		}
	})
});

// Clears the active links
function clearActiveLinks() {
	$('#navbarList .nav-item .nav-link').each(function() {
		$(this).removeClass('active');
	});
}

// Clears the active divs
function clearActiveDivs() {
	$('.container .content .active').each(function() {
		$(this).removeClass('active');
		$(this).hide();
	});
}

// Activates the link
function activateLink(e) {
	$(e.target).addClass('active');
	
	// Hide left panel
	if(e.target.id == "particular")
		$('#leftPanel').hide();
	else
		$('#leftPanel').show();
}

// Activates the div
function activateDiv(divId) {
	$(divId).addClass('active');
	$(divId).show();

	// Scrolls to the content
	scrollToContent(divId);
}

// Scrolls to the content
function scrollToContent(divId) {
	if ($(window).width() < 751) {
		$('html, body').animate({
			scrollTop: $(divId).offset().top
		}, 1);
	}
}