<?php
    header("Content-type: application/xhtml+xml");

    set_time_limit(10);
    print file_get_contents('http://github.com/feeds/fate/commits/Mootools-MVC/master');
    set_time_limit(30);

