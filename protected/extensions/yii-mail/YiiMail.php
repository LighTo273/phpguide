<?php
/**
* YiiMail class file.
*
* @author Jonah Turnquist <poppitypop@gmail.com>
* @link https://code.google.com/p/yii-mail/
* @package Yii-Mail
*/

/**
* YiiMail is an application component used for sending email.
*
* You may configure it as below.  Check the public attributes and setter
* methods of this class for more options.
* <pre>
* return array(
* 	...
* 	'import => array(
* 		...
* 		'ext.mail.YiiMailMessage',
* 	),
* 	'components' => array(
* 		'mail' => array(
* 			'class' => 'ext.yii-mail.YiiMail',
* 			'transportType' => 'php',
* 			'viewPath' => 'application.views.mail',
* 			'logging' => true,
* 			'dryRun' => false
* 		),
* 		...
* 	)
* );
* </pre>
* 
* Example usage:
* <pre>
* $message = new YiiMailMessage;
* $message->setBody('Message content here with HTML', 'text/html');
* $message->subject = 'My Subject';
* $message->addTo('johnDoe@domain.com');
* $message->from = Yii::app()->params['adminEmail'];
* Yii::app()->mail->send($message);
* </pre>
*/
class YiiMail extends CApplicationComponent
{
	/**
	* @var bool whether to log messages using Yii::log().
	* Defaults to true.
	*/
	public $logging = true;
	
	/**
	* @var bool whether to disable actually sending mail.
	* Defaults to false.
	*/
	public $dryRun = false;
	
	/**
	* @var string the delivery type.  Can be either 'php' or 'smtp'.  When 
	* using 'php', PHP's {@link mail()} function will be used.
	* Defaults to 'php'.
	*/
	public $transportType = 'php';
	
	/**
	* @var string the path to the location where mail views are stored.
	* Defaults to 'application.views.mail'.
	*/
	public $viewPath = 'application.views.mail';
	
	/**
	* @var string options specific to the transport type being used.
	* To set options for STMP, set this attribute to an array where the keys 
	* are the option names and the values are their values.
	* Possible options for SMTP are:
	* <ul>
	* 	<li>host</li>
	* 	<li>username</li>
	* 	<li>password</li>
	* 	<li>port</li>
	* 	<li>encryption</li>
	* 	<li>timeout</li>
	* 	<li>extensionHandlers</li>
	* </ul>
	* See the SwiftMailer documentaion for the option meanings.
	*/
	public $transportOptions = array();
	
	/**
	* @var mixed Holds the SwiftMailer transport
	*/
	protected $transport;

	/**
	* @var mixed Holds the SwiftMailer mailer
	*/
	protected $mailer;

	private static $registeredScripts = false;

	/**
	* Calls the {@link registerScripts()} method.
	*/
	public function init() {
		$this->registerScripts();
		parent::init();	
	}
	
	/**
	* Send a {@link YiiMailMessage} as it would be sent in a mail client.
	* 
	* All recipients (with the exception of Bcc) will be able to see the other
	* recipients this message was sent to.
	* 
	* If you need to send to each recipient without disclosing details about the
	* other recipients see {@link batchSend()}.
	* 
	* Recipient/sender data will be retreived from the {@link YiiMailMessage} 
	* object.
	* 
	* The return value is the number of recipients who were accepted for
	* delivery.
	* 
	* @param YiiMailMessage $message
	* @param array &$failedRecipients, optional
	* @return int
	* @see batchSend()
	*/
	public function send(YiiMailMessage $message, &$failedRecipients = null) {

		if ($this->logging===true) self::log($message);
		if ($this->dryRun===true) return count($message->to);
		else return $this->getMailer()->send($message->message, $failedRecipients);

	}


	
	/**
	* Sends a message in an extremly simple but less extensive way.
	* 
	* @param mixed from address, string or array of the form $address => $name
	* @param mixed to address, string or array of the form $address => $name
	* @param string subject
	* @param string body
	*/
	public function sendSimple($from, $to, $subject, $body) {
		$message = new YiiMailMessage;
		$message->setSubject($subject)
			->setFrom($from)
			->setTo($to)
			->setBody($body, 'text/html');
		
		if ($this->dryRun===true) $res = count($message->to);
		else $res = $this->getMailer()->send($message);

        if ($this->logging===true)
        {
            self::log($message, $res);
        }
	}

	/**
	* Logs a YiiMailMessage in a (hopefully) readable way using Yii::log.
	* @return string log message
	*/
	public static function log(YiiMailMessage $message, $response = null) {
		$msg = 'Sending email to '.implode(', ', array_keys($message->to))."\n".
			implode('', $message->headers->getAll())."\n".
			$message->body."\n".
            'response: '.$response
		;
		Yii::log($msg, CLogger::LEVEL_INFO, 'ext.yii-mail.YiiMail');
		// TODO: attempt to determine alias/category at runtime
		return $msg;
	}

	/**
	* Gets the SwiftMailer transport class instance, initializing it if it has 
	* not been created yet
	* @return mixed {@link Swift_MailTransport} or {@link Swift_SmtpTransport}
	*/
	public function getTransport() {
		if ($this->transport===null) {
			switch ($this->transportType) {
				case 'php':
                    //echo 'building php';
					$this->transport = Swift_MailTransport::newInstance();
					if ($this->transportOptions !== null)
						$this->transport->setExtraParams($this->transportOptions);
					break;
				case 'smtp':
                    //echo 'building smtp transport';
					$this->transport = Swift_SmtpTransport::newInstance();

                    // sets option with the setter method
                    if(is_array($this->transportOptions) && !empty($this->transportOptions))
					    foreach ($this->transportOptions as $option => $value)
                        {
                            $methodName = 'set'.ucfirst($option);
                            if(method_exists($this->transport, $methodName) || in_array($option, ['username', 'password'], true))
						        $this->transport->{$methodName}($value);
                        }

					break;
                default:
                    //echo 'building nothing';
			}
		}
		
		return $this->transport;
	}
	
	/**
	* Gets the SwiftMailer {@link Swift_Mailer} class instance
	* @return Swift_Mailer
	*/
	public function getMailer() {
		if ($this->mailer===null)
			$this->mailer = Swift_Mailer::newInstance($this->getTransport());
			
		return $this->mailer;
	}
	
    /**
    * Registers swiftMailer autoloader and includes the required files
    */
    public function registerScripts() {
    	if (self::$registeredScripts) return;
    	self::$registeredScripts = true;
	}
}