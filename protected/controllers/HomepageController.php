<?php

class HomepageController extends PHPGController
{
   
    public function actionIndex()
    {
        $posts_per_page = 10;
        $page = 0;

        if(isset($_GET['page']))
        {
            $page = intval($_GET['page']) - 1;
            if($page < 0) $page = 0;
            if($page > 100000) $page = 0;
        }

        $this->mainNavSelectedItem = MainNavBarWidget::POSTS;
        $this->subNavSelectedItem = SubNavBarWidget::POSTS_NEWEST;

        $totalPages = ceil( Article::model()->count() / $posts_per_page );

        $this->render('index' ,
            [
                'articles'     => Article::model()->byPage($page, $posts_per_page)->findAll(),
                'paginationTotalPages' => $totalPages,
                'paginationCurrentPage' => $page+1
            ]
        );
    }
        

    public function actionError()
    {
        // empty layout without header, footer, sidebar
        $this->layout = '/';

        if( false !== ($error =  Yii::app()->errorHandler->error ))
        {
            if($error['type'] === 'CHttpException' and $error['code'] === 404)
            {
                if( !empty($error['message']) )
                {
                    $alternatives = Article::model()->similarTo($error['message'])->findAll();
                }
                else
                {
                    $alternatives = Article::model()->findAll(array('limit' => 8, 'order' => 'pub_date DESC'));
                }
		
                $this->render('error_404', array('alternatives' => $alternatives));
            }
            else
            {
                $this->render('error_500');
                Yii::log($error['message'], CLogger::LEVEL_ERROR, '500');
                //if(YII_DEBUG || ( !Yii::app()->user->isguest &&  Yii::app()->user->is_admin )) echo $error['message'];
            }

        }
        else
        {
            $this->redirect(Yii::app()->homeUrl);
        }

    }

    /**
     * Displays site posts as RSS feed 
     */
    public function actionRss($showFullPosts = false)
    {
        $this->layout = '/';
        $this->render('rss' ,['articles'   => Article::model()->byPage(0, 10)->publishedOnly()->findAll(), 'showFullPosts' => $showFullPosts]);
    }
    /**
     * Generates sitemap. available only via webcron from localhost
     */
    public function actionSitemap()
    {
    	// available only when browsing from servers addr
    	// Amazon's server ip, hardcoded. Not the best solution, but
    	// this script is ran by webcron (since I can't use console application for it, which is not aware of controllers, nor of createUrl functions)
    	// and $_SERVER['SERVER_ADDR'] returns the internal amazons IP and not the external one, used by curl/wget.
    	/**
    	 * @todo get a better solution
    	 */
    	if(!YII_DEBUG) return;

    	
    	$items = Yii::app()->db->createCommand("
    			
	    			SELECT 
	    				'article' as 'type', 
	    				id, 
	    				url as 'loc', 
	    				DATE_FORMAT(`pub_date`,'%Y-%m-%d') as 'lastmod', 
	    				0.9 as 'priority', 
	    				'monthly' as 'freq' 
	    			FROM `blog` WHERE `approved`= ".Article::APPROVED_PUBLISHED."
    			
    			UNION
    			
    				SELECT 
    					'qna' as 'type', 	
    					qid as 'id', 
    					subject as 'loc', 
    					DATE_FORMAT(`time`,'%Y-%m-%d') as 'lastmod', 
    					0.4 as 'priority', 
    					'daily' as 'freq' 
    				FROM qna_questions WHERE time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    			
    			UNION
    			
    				SELECT 
    					'qna' as 'type', 
    					qid as 'id', 
    					subject as 'loc', 
    					DATE_FORMAT(`time`,'%Y-%m-%d') as 'lastmod', 
    					0.4 as 'priority', 
    					'monthly' as 'freq' 
    				FROM qna_questions WHERE time < DATE_SUB(NOW(), INTERVAL 7 DAY)
    			
    			")->queryAll();
    	
    	
    	$sitemap = $this->renderPartial('sitemap', array('items' => $items), true);
    	file_put_contents(Yii::app()->getBasePath().'/../static/sitemap.xml' , $sitemap);
    	echo $sitemap; 
    }
    
}