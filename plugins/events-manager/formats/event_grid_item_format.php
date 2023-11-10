<div class="em-event em-item" data-href="#_EVENTURL" style="--default-border:#_CATEGORYCOLOR;">
	<div class="em-item-image {no_image}has-placeholder{/no_image}">
		<div class="em-item-image-wrapper">
			{has_image}
			#_EVENTIMAGE{medium}
			{/has_image}
			{no_image}
			<div class="em-item-image-placeholder">
				<div class="date">
					<span class="day">#d</span>
					<span class="month">#M</span>
				</div>
			</div>
			{/no_image}
		</div>
	</div>
	<div class="em-item-info">
		<h3 class="em-item-title">#_EVENTLINK</h3>
		<div class="em-event-meta em-item-meta">
			<div class="em-item-meta-line em-event-date em-event-meta-datetime">
				<span class="em-icon-calendar em-icon"></span>
				#_EVENTDATES
			</div>
			<div class="em-item-meta-line em-event-time em-event-meta-datetime">
				<span class="em-icon-clock em-icon"></span>
				#_EVENTTIMES
			</div>
			{bookings_open}
			<div class="em-item-meta-line em-event-prices">
				<span class="em-icon-ticket em-icon"></span>
				#_EVENTPRICERANGE
			</div>
			{/bookings_open}
			{has_location_venue}
			<div class="em-item-meta-line em-event-location">
				<span class="em-icon-location em-icon"></span>
				#_LOCATIONLINK
			</div>
			{/has_location_venue}
			{has_event_location}
			<div class="em-item-meta-line em-event-location">
				<span class="em-icon-at em-icon"></span>
				#_EVENTLOCATION
			</div>
			{/has_event_location}
		</div>
	</div>
</div>


<li  class="wp-block-post event type-event status-publish {no_image}has-post-thumbnail{/no_image}">

	<div class="em-item-image {no_image}has-placeholder{/no_image}">
		<div class="em-item-image-wrapper">
			{has_image}
			#_EVENTIMAGE{medium}
			{/has_image}
			{no_image}
			<div class="em-item-image-placeholder">
				<div class="date">
					<span class="day">#d</span>
					<span class="month">#M</span>
				</div>
			</div>
			{/no_image}
		</div>
	</div>
	{has_image}
    <figure style="width:100%;height:clamp(15vw, 30vh, 400px);" class="alignwide wp-block-post-featured-image">
		<a href="#_EVENTURL" target="_self" style="height:clamp(15vw, 30vh, 400px)">#_EVENTIMAGE{medium}
		</a>
	</figure>
	{/has_image}

    <div class="wp-block-group card-body events__body has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
        <div class="wp-block-group events__body-inner card-body-inner has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
            <div class="wp-block-post-date has-sans-font-family">
				<time datetime="#c">#_{F j | g:i A}</time>
			</div>

            <h3 class="events__title card-title wp-block-post-title"><a
                    href="http://redkeyclub.test/events/office-hours-january/" target="_self">Office Hours</a></h3>

            <div class="taxonomy-event-categories wp-block-post-terms">#_EVENTCATEGORIES</div>

            <div class="wp-block-post-excerpt">
                <p class="wp-block-post-excerpt__excerpt">It’s open office hours! This is a chance to get some
                    personalized perspective on the obstacles you’re facing in your… </p>
            </div>
        </div>



        <div
            class="wp-block-group card-actions events__actions has-white-color has-primary-background-color has-text-color has-background has-link-color wp-elements-2b169479666d085591b923c855e10acf has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
            <p class="events__actions-location">Location</p>


            <div class="wp-block-post-date"><time datetime="2024-01-19T10:00:00-08:00">PST</time></div>
        </div>
    </div>

</li>