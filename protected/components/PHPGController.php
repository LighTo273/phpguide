<?php
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class PHPGController extends CController
{
	/**
	 * @var string the default layout for the controller view. Defaults to '//layouts/column1',
	 * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
	 */
	public $layout='//layouts/main';

	/**
	 * @var array context menu items. This property will be assigned to {@link CMenu::items}.
	 */
	public $menu=array();

    /**
	 * @var array the breadcrumbs of the current page. The value of this property will
	 * be assigned to {@link CBreadcrumbs::links}. Please refer to {@link CBreadcrumbs::links}
	 * for more details on how to specify this property.
	 */
	public $breadcrumbs=array();
        

    /**
     * Facebook microformats data, used to help facebook get an idea what is this page about
     * @var array $facebook
     */
    protected $facebook = array
    (
        'image' => '',            // set after getting host
        'current_page_url' => '', // set at runtime, when request's url is known
        'site_name' => 'מדריך לימוד PHP — phpguide.co.il',
        'admins' => '100001276887326',
        'app_id' => '188852921151034',
        'type' => 'blog'
    );
    
   
    /**
     * <meta> keywords
     * @var string
     */
    public $keywords = 'מדריך, לימוד, PHP';
    
    /**
     * <meta> author
     * @var string
     */
    public $pageAuthor = 'אלכסנדר רסקין';
    
    /**
     * <meta> description
     * @var string
     */
    public $description = "לימוד PHP, מדריכי בניית אתרים, לימוד SQL";
    
    /**
     * <title> of the page, overrides CController->pageTitle
     * @var string
     */
    public $pageTitle = 'לימוד PHP | מדריכי PHP | שאלות PHP';


    /**
     * Which item in the top navigation should be set as active
     * @var string
     */
    public $mainNavSelectedItem = null;

    /**
     * Which item is the sub navigation should be set as active
     * @var string
     */
    public $subNavSelectedItem = null;

    /**
     * defines the meta microformat schema for the document. 
     * Could be: Artile, Blog, Book, Person, Product, Review, Other, Event, Organization, LocalBusiness,
     * @see http://schema.org/docs/schemas.html
     * @var string
     */
    public $metaType = 'Blog';


    /** @var array $jstate - registered and passed to javascript */
    private $jsState = [];

    protected function beforeRender($action)
    {
        $this->registerJsStateScriptBlock();
        return parent::beforeRender($action);
    }

    private function registerJsStateScriptBlock()
    {
        if(empty($this->jsState))
            return;

        $codeBlock = "window.phpgstate = ".json_encode($this->jsState).";";
        Yii::app()->clientScript->registerScript('phpgstate', $codeBlock, CClientScript::POS_BEGIN);
    }


    protected function MergeJsState(array $data)
    {
        $this->jsState = array_merge($this->jsState, $data);
    }
    
    /**
     * This is the action to handle external exceptions.
     */
    public function actionError()
    {
        if(false !== ($error=Yii::app()->errorHandler->error))
        {
            if(Yii::app()->request->isAjaxRequest)
                echo $error['message'];
            else
                $this->render('//error', $error);
        }
    }


    /**
     * Registers client script from URL and adds it to lateload
     * Takes the scripts from static/scripts/___.js folder, automatically appending file extension
     * @param $scripts
     * @internal param \args $script list of arguments, each argument should be a different script
     * @example $this->addscript('ui') results in <script src='static/scripts/ui.js'>
     * @example $this->addscript('ui', 'bbcode', 'http://jquery.com/jquery.js');
     */
    protected function addscripts($scripts)
    {
        foreach (func_get_args() as $url)
        {
            if (!preg_match('#(http://|https://|//)#i', $url))
            {
                $url = $this->getAssetsBase()."/scripts/$url.js";
            }
            Yii::app()->clientScript->registerScriptFile($url, CClientScript::POS_END);
        }
    }
    
    /**
     * You are not supposed to call this method directly, i guess
     * @param string $id
     * @param CWebModule $module
     */
    public function __construct($id, CWebModule $module = null)
    {
        if(!isset($_SERVER["HTTP_USER_AGENT"]) || stristr($_SERVER["HTTP_USER_AGENT"],'facebook') === FALSE)
        {
            // should display microformats metadata only to facebook client
            $this->facebook = null;
        }
        else
        {
            // nginx access apache via internal communications, therefore REQUEST_URI
            // is missing. But nginx kindly pushes that value into another server var.
            $this->facebook['current_page_url'] = 'http://' . $_SERVER['HTTP_HOST'] . (isset($_SERVER["REDIRECT_URL"]) ? $_SERVER["REDIRECT_URL"] : $_SERVER["REQUEST_URI"]);
            $this->facebook['image'] = 'http://' . $_SERVER['HTTP_HOST'] . '/static/images/logo.jpg';
        }

		$this->registerPageScripts();

        parent::__construct($id, $module);
    }


    private function registerPageScripts()
    {

        Yii::app()->clientScript->coreScriptPosition = CClientScript::POS_END;
        $this->registerUserInfoScriptBlock();
    }

    private function registerUserInfoScriptBlock()
    {
        if(!Yii::app()->user->isguest)
        {
            $user = Yii::app()->user->getUserInstance();

            $userInfoCode = "
                window.user = {
                    id:   '{$user->id}',
                    nick: '{$user->login}'
                };
            ";

            Yii::app()->clientScript->registerScript('userInfo', $userInfoCode, CClientScript::POS_BEGIN);  
        }
    }



    /**
    * Returns the base path to the assets dir
    */ 
    public function getAssetsBase()
    {
        return bu('static');
    }

    public static function getAssetsBaseStatic()
    {
        /*** @var $controller \PHPGController */
        $controller = Yii::app()->getController();
        return $controller->getAssetsBase();
    }
        
}



