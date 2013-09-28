<?php
/** @var $currentLoggedInUserEmail string */
/** @var $currentUserFirstName string */
/** @var $articleCategory string */
/** @var $article Article */
?>
    <h1 class='content-title'><span></span><?=e($article->title);?></h1>
    
    <!-- publisher -->
    <div id="content-publishing-info">
        <div class="right"><?=e($article->author->login);?>, </div>
        <div class="right">&nbsp;<time datetime="<?=$article->pub_date->date2rfc()?>"  dir="rtl"><?=$article->pub_date->date2heb();?></time></div>
        <div class="clear"></div>
    </div>

    <!-- content -->
    <article>
        <header>

            <div class="right post-image">
                <img src="/static/images/pixel.gif" title="<?=e($article->image)?>" alt="<?=e($article->title)?>" />
            </div>
            <div class="right post-content">
                <?=$article->html_desc_paragraph?>   <br/>
            </div>
            <div class="clear"></div>

        </header>
        <br/><br/>
        <?=$article->html_content?>
    </article>
    
    <br/><br/>
    <br/><br/>

    <?php
        $nginit = "email='".e($currentLoggedInUserEmail)."';".
                  "name='".e($currentUserFirstName)."';".
                  "category='".e($articleCategory)."';".
                  "csrf='".e(Yii::app()->request->csrfToken)."';";
    ?>

    <?php if(Yii::app()->user->isGuest || !Yii::app()->user->getUserInstance()->hasMailSubscription): ?>
    <div ng-controller="MailSubscriptionCtrl" ng-init="<?=$nginit?>">
        <div id="inPostSubscribe" class="inPostMailSubscriptionForm" ng-show="!isSubscribed">

            <h3>
                למד עוד על
                {{ keyword }}

                <span ng-show="keyword">
ועוד
                </span>
                דברים מעניינים בתחום ה-{{ category }}
                ו-PHP.
                <br/>
                הירשם לרשימת התפוצה, קבל ישירות את התוכן הכי טוב ועלה ברמה המקצועית שלך

            </h3>
            <br/>

            <div class="alert alert-{{alertType}}" ng-show="submitResulted || submitInProgress">
                {{ alertText }}
            </div>

            <div class="form-horizontal">
                <div class="control-group">
                    <label class="control-label" for="mailSubscribeName">
                        שם
                    </label>
                    <div class="controls">
                        <input type="text" id="mailSubscribeName" ng-model="name" />
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label" for="mailSubscribeMail">
                        אימייל
                    </label>
                    <div class="controls">
                            <input type="email" id="mailSubscribeMail" ng-model="email" dir="ltr" />
                    </div>
                </div>
                <div class="control-group">
                    <div class="controls">
                        <button ng-click="subscribe()" class="btn btn-info" ng-disabled="submitInProgress">
                            הירשם לעדכונים ומידע חדש
                        </button>
                    </div>
                </div>

                 <span>
                     בממוצע תקבל מייל אחד לשבוע עם חומר לימודי חדש מעולם ה-PHP
                     ופיתוח אינטרנט.
                     <br/>
חוץ מזה                     אנחנו שונאים ספאם. כל מייל מכיל קישור להסרה מהרשימה, ככה שתוכל להפסיק לקבל מיילים מתי שתרצה
                </span>

            </div>


        </div>
    </div>
    <?php endif; ?>
    <hr/>
   
   
    <div style="margin-top:15px;position:relative;">
    	<div class='likeus'></div>
        <div class="right" style="padding:5px; font-size: 85%;line-height: 16px; margin-bottom: 25px;  width:400px">
           
        <img src="/static/images/pixel.gif" title="<?php $this->widget('GravatarWidget', array('email' => $article->author->email, 'size' => 50, 'linkOnly' => true)); ?>" alt="<?=e($article->author->login)?>" width="50" height="50" class="right"/>
        <p style=" margin-right:10px; width:245px" class="right">
            על המחבר:
          
            <b><a href='<?=bu('users/').urlencode($article->author->login)?>'><?=e($article->author->login)?></a></b>             
        </p>
        <div class="clear"></div>
    </div>
        
        <div  id="like_for_concrete_post" class="left" style="margin:10px  0 0 10px;width:50px;"></div>
        <div  id="plusone_for_concrete_post" class="left" style="margin:10px  0 0 10px;"></div>
        <div class='clear'></div>
    
    	<?php  if(!Yii::app()->user->isguest && ($article->author->id === Yii::app()->user->id || Yii::app()->user->is_admin)):  ?>
	        <div><a href="<?= bu('Add?edit='.$article->id)?>">Edit this article</a></div><br/>
	        <div class='clear'></div>
        <?php endif; ?>

        <?php
        if(!Yii::app()->user->isguest && Yii::app()->user->is_admin): ?>
            <div>
                <? if($article->approved != Article::APPROVED_PUBLISHED) { ?>
                    <a href="<?= bu('Add/approve?id='.$article->id)?>">Approve for homepage</a><br/>
                <? }
                   if($article->approved != Article::APPROVED_SANDBOX){
                ?>
                    <a href="<?= bu('Add/send2Sandbox?id='.$article->id)?>">Send to Sandbox</a><br/>
                <? } else { ?>
                    Currently in sandbox<br/>
                <? }
                   if($article->approved != Article::APPROVED_NONE){
                ?>
                    <a href="<?= bu('Add/disapprove?id='.$article->id)?>">Disapprove the publication</a>
                <? } ?>
            </div>
            <div class='clear'></div>
        <?php endif; ?>
    </div>
    
 
    
    
    <?php  $this->renderPartial('//article/comments', array('comments' => $article->comments)); ?>


    
        
    <a name='comments_form' ></a>    
	<div class="comment-table" id="comments_form">
            <b style="color:green">
            פרגן, מה אכפת לך :)
            </b>
	    <br/><br/>
	    <?php echo CHtml::beginForm('', 'post', array('id' => 'comments_inputs', 'class' => 'form-stacked')); ?>
	    
		<?= Chtml::hiddenField("Comment[blogid]", e($article->id))?>

		<div id="comments_alert"></div>
		<div class="clearfix">
		    <label for="textarea">תגובה</label>
		    <?= CHtml::textArea("Comment[text]", '', array('id' => 'commenttext')) ?>
		</div>
		<div class="form-actions">
	
אל תתבייש, חשוב לנו לדעת מה אתה חושב -->	    

		    <?=CHtml::ajaxSubmitButton(
			    'שלח תגובה!'
			    ,bu('comments/add') ,
			    array('success' => 'comment_sumbitted_callback', 'beforeSend' => 'sendcomment'), 
			    array('class'=> 'btn btn-primary', 'id' => 'addCommentBtn'))?>

		</div>
		<?php echo CHtml::endForm();?>
	    
	</div>
	<img src="static/images/ajax-loader.gif" id="comments_loading_img"/>    
	    
	    
	    
