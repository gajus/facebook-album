<?php
namespace ay;

/**
 * Univeral class to handle remote file downloading.
 *
 * https://github.com/gajus/download-remote
 *
 * Author: Gajus Kuizinas <g.kuizinas@anuary.com>
 */
class DownloadRemote
{
	private $url;
	private $temp_file_prefix		= 'random-value';
	private $temp_file;

	public function __construct($url)
	{
		$this->url	= $url;
	}
	
	public function getMimeType()
	{
		if(!$this->temp_file)
		{
			throw new DownloadRemoteException('File first needs to be downloaded.');
		}
	
		$finfo		= new \finfo(FILEINFO_MIME);
		
		return $finfo->file($this->temp_file);
	}
	
	/**
	 * @param	integer	File size limit in bytes.
	 *
	 * @return	boolean	Indicates whether the size_limit has been breached.
	 */
	public function download($size_limit)
	{
		if($this->temp_file)
		{
			throw new DownloadRemoteException('Resource has been downloaded already.');
		}
	
		$this->temp_file	= tempnam(sys_get_temp_dir(), $this->temp_file_prefix);
	
		$src	= fopen($this->url, 'r');
		$dest	= fopen($this->temp_file, 'w+');
		
		stream_copy_to_stream($src, $dest, $size_limit+1000);
		
		return filesize($this->temp_file) < $size_limit;
	}
	
	public function save($path)
	{
		return rename($this->temp_file, $path);
	}
}

class DownloadRemoteException extends \Exception {}