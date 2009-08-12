<?php header('Content-type: application/javascript'); ?>/*
Script: *
	MooTools MVC - A MVC Approach for the MooTools Javascript Framework

License:
	Custom License.

Copyright:
	Copyright (c) 2009 [Sven Eisenschmidt](http://unsicherheitsagent.de/).


Inspiration:
	- MooTools Framework
        - Zend Framework
*/
<?php

class mvcJavascriptComposer
{
    protected $paths = array();
    protected $files = array();
    protected $badlist = array();

    function __construct($whitelist, $badlist)
    {
      $this->badlist     = $badlist;
      $this->whitelist   = $whitelist;
    }
    public function addPath($path)
    {
        $this->paths[] = $path;
    }


    public function get()
    {
      $folders  = array();
      $files    = array();

      $folders = array();
      foreach ($this->paths as $path) {
        $folders = array_merge($folders, array($path), $this->getFolders($path));
      }


      foreach ($folders as $folder) {
        $files = array_merge($files, $this->getFiles($folder));
      }

      return $files;
    }


    protected function getFiles($path)
    {
      $files = $this->filterArray(scandir($path));

      foreach($files as $key => $file) {
        foreach($this->whitelist as $entry) {
          if(!strpos($file, $entry)) {
            unset($files[$key]);
          } else {
            $files[$key] = $path . $file;
          }
        }
      }
      return $files;
    }


    protected function filterArray($array)
    {
        $array = array_diff($array, $this->badlist);
        
        foreach($array as $key => $value) {
            foreach($this->badlist as $badString) {
                // strlen($badString)
                if((substr($value, strlen($value) -  strlen($badString), strlen($value))) == $badString) {
                    unset($array[$key]);
                }
            }
        }
        
        return $array;
    }

    protected function getFolders($path)
    {
      $files = $this->filterArray(scandir($path));
      $folders = array();
      foreach ($files as $key => $file) {
        if (is_dir($path . $file . '/')) {
          $folder = $path . $file . '/';

          $folders[] = $folder;

          $folders = array_merge($folders, $this->getFolders($folder));

        }
      }
      return $folders;
    }

   public function combine($array)
    {
        $output = '';
        foreach($array as $path) {
          $dir = substr($path, strripos($path, "assets"), strlen($path));

          $output .= "\n\n\n" . '/* File: "' . $dir . '"  */' . "\n";
          $output .= file_get_contents($path);
        }

        return $output;
    }


}

$library = new mvcJavascriptComposer(array('.js'), array('.', '..', '.json'));
$library->addPath(realpath(dirname(__FILE__) ). '/lib/mvc/');
$library->addPath(realpath(dirname(__FILE__) ). '/usr/');
$files = $library->get();
$file = $library->combine($files);

print str_replace('$Id$', '0.1', $file);