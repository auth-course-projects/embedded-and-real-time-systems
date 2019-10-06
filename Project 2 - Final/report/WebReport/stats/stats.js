// Timeline.js: Assumes existance of session.json file next to session.html that
// imported this script.
//
// Description: Parses json file and uses handlebars lib to render each event
// and each message of each event to the timeline.
//
// Dependencies: handlebars.js ( /vendor/handlebars ), session.json ( ./ )
// Author: Thanasis Charisoudis ( https://github.com/achariso )

let app;

// Wait for DOM to load before executing
document.addEventListener( 'DOMContentLoaded', function(){

    // Get session index
	const findGetParameter = function( parameterName ) {

		var result = null,
			tmp = [];
		var items = location.search.substr(1).split("&");
		for (var index = 0; index < items.length; index++) {
			tmp = items[index].split("=");
			if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
		}

		return result;
	}

	// Get session index
  const sessionIndex = findGetParameter( 'session' );
  const deviceAem = findGetParameter( 'device' );

	// Define paths
	const app_paths = {
	  json: `../Sessions/${deviceAem}/session${sessionIndex}.json`,
	  templates: './Templates'
	}

	// Define app parameters
	app = {
	  paths: app_paths,
	  template_names: ['MessageStats', 'DeviceStats', 'FinalBufferStateStats', 'Message'],
	  templates: {},
	  session: {}
	}

    // Display Session Index
	$( '.sessionIndex' ).text( sessionIndex )

	// Import json file
	let jsonPromise = new Promise( (resolve, reject) => {

	  fetch( app.paths.json )
		.then( response => response.json() )
		.then( session => {
		  app.session = session;
		  resolve( app.paths.json );
		})
		.catch( err => console.log( 'Fetch Error :-S', err ) );

	});

	// Import Templates
	let templatePromises =
	  app.template_names.map( template =>
		new Promise( (resolve, reject) =>
		  fetch( app.paths.templates + '/' + template + '.handlebars' )
			.then( response =>

			  response.text().then( html => {
				app.templates[template] = Handlebars.compile( html );
				Handlebars.registerPartial( template, app.templates[template] );

				resolve( template );
			  })
		  )
		)
	  );

	// Render using handlebars
	const renderSession = function()
	{
	  // Handlebars helper to trim message body
	  Handlebars.registerHelper( 'trim_body', function( options ) {
			let body = options.fn( this );
			let maxLength = 30;

			return body.length > maxLength ?
			  body.substr( 0, maxLength - 4 ) + ' [&hellip;]':
			  body;
	  });

	  // Handlebars helper to trim message body
	  Handlebars.registerHelper( 'pad_zeros', function( options ) {
			let aem = options.fn( this );
			return aem.toString().padStart(4, '0');
	  });

	  // Handlebars helper to augment {{#if}} helper
	  Handlebars.registerHelper({
			eq: function (v1, v2) {
				return v1 === v2;
			},
			ne: function (v1, v2) {
				return v1 !== v2;
			},
			lt: function (v1, v2) {
				return v1 < v2;
			},
			gt: function (v1, v2) {
				return v1 > v2;
			},
			lte: function (v1, v2) {
				return v1 <= v2;
			},
			gte: function (v1, v2) {
				return v1 >= v2;
			},
			and: function () {
				return Array.prototype.slice.call(arguments).every(Boolean);
			},
			or: function () {
				return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
			}
	  });

	  // Handlebars helper to output correct message icon
	  Handlebars.registerHelper( 'class_icon', function( options ) {
			let action = options.fn( this );
			let icon;

			switch (action) {
			  case 'datetime':
				icon = 'fa-refresh';
				break;
			  case 'produced':
				icon = 'fa-asterisk text-success';
				break;
			  case 'transmitted':
				icon = 'fa-long-arrow-right text-danger';
				break;
			  default:
				icon = 'fa-long-arrow-left text-blue';
				break;
			}

			return icon;
	  });

		// Render message stats
	  const messageStatsRenderElement = document.getElementById('messageStats');
		messageStatsRenderElement.innerHTML = app.templates.MessageStats( app.session.stats );

		// Render device stats
	  const deviceStatsRenderElement = document.getElementById('deviceStats');
		deviceStatsRenderElement.innerHTML = app.templates.DeviceStats( app.session.stats );

		// Render final buffer state
	  const finalBufferStateElement = document.getElementById('finalBufferState');
		finalBufferStateElement.innerHTML = app.templates.FinalBufferStateStats( app.session.stats );
	}

    // Load app
	Promise.all( templatePromises.concat( jsonPromise ) )
	  .then( () => renderSession() )
	  .catch( err => console.log( 'Fetch Error :-S', err ) );

}, false );


// // Message details view
// const renderMessageDetails = function( _this ) {
//
//   // Get message entry
//   let messageIndex = _this.closest( '[data-template="message"]' ).getAttribute( 'data-index' );
//   let eventIndex = _this.closest( '[data-template="event"]' ).getAttribute( 'data-index' );
//   let message = app.session.events[eventIndex].messages[messageIndex];
//
//   eventIndex++;
//   messageIndex++;
//
//   // Get message details per message type
//   switch (message.action) {
// 	case 'datetime':
// 	  messageFormInputs = getDatetimeMessageFormInputs( message );
// 	  break;
// 	case 'produced':
// 	  messageFormInputs = getProductionMessageFormInputs( message );
// 	  break;
// 	default:
// 	  messageFormInputs = getConnectionMessageFormInputs( message );
//   }
//
//   // Open modal filled with message details
//   let modal = bootbox.dialog({
// 	title: `Event <b>${eventIndex}</b> &nbsp;<i class="fa fa-chevron-right"></i>&nbsp;
// 	  Message <b>${messageIndex}</b> &nbsp;<i class="fa fa-chevron-right"></i>&nbsp; <b>Details</b>`,
// 	message: `
// 	  <form class="form-horizontal" action="#">
//
// 		<div class="form-group">
// 		  <label class="col-md-2 control-label">Action</label>
// 		  <div class="col-md-10">
// 			<input type="text" class="form-control" disabled value="${message.action}">
// 		  </div>
// 		</div>
//
// 		<div class="form-group">
// 		  <label class="col-md-2 control-label">Saved At</label>
// 		  <div class="col-md-10">
// 			<input type="text" class="form-control" disabled value="${message.saved_at}">
// 		  </div>
// 		</div>
//
// 		<hr>
//
// 		${messageFormInputs}
//
// 	  </form>
// 	`
//   });
//
// };
//
// function getConnectionMessageFormInputs( message ) {
//   return getProductionMessageFormInputs( message ) + `
//
//     <hr>
//
//     <div class="form-group">
//       <label class="col-md-2 control-label">Transmitted</label>
//       <div class="col-md-10">
//         <input type="text" class="form-control" disabled value="${message.transmitted}">
//       </div>
//     </div>
//
//     <div class="form-group">
//       <label class="col-md-2 control-label">Transmitted Devices</label>
//       <div class="col-md-10">
//         <textarea class="form-control" disabled rows="2">${message.transmitted_devices}</textarea>
//       </div>
//     </div>
//   `;
// }
//
// function getDatetimeMessageFormInputs( message ) {
//   return `
//     <div class="form-group">
//       <label class="col-md-2 control-label">Previous NOW()</label>
//       <div class="col-md-10">
//         <input type="text" class="form-control" disabled value="${message.previous_now}">
//       </div>
//     </div>
//
//     <div class="form-group">
//       <label class="col-md-2 control-label">New NOW()</label>
//       <div class="col-md-10">
//         <input type="text" class="form-control" disabled value="${message.new_now}">
//       </div>
//     </div>
//   `;
// }
//
// function getProductionMessageFormInputs( message ) {
//   message.sender = message.sender.toString().padStart(4, '0');
//   message.recipient = message.recipient.toString().padStart(4, '0');
//
//   return `
//     <div class="form-group">
//       <label class="col-md-2 control-label">Sender</label>
//       <div class="col-md-10">
//         <input type="text" class="form-control" disabled value="${message.sender}">
//       </div>
//     </div>
//
//     <div class="form-group">
//       <label class="col-md-2 control-label">Recipient</label>
//       <div class="col-md-10">
//         <input type="text" class="form-control" disabled value="${message.recipient}">
//       </div>
//     </div>
//
//     <div class="form-group">
//       <label class="col-md-2 control-label">Created At</label>
//       <div class="col-md-10">
//         <input type="text" class="form-control" disabled value="${message.created_at}">
//       </div>
//     </div>
//
//     <div class="form-group">
//       <label class="col-md-2 control-label">Body</label>
//       <div class="col-md-10">
//         <textarea class="form-control" disabled rows="7">${message.body}</textarea>
//       </div>
//     </div>
//   `;
// }
