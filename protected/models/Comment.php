<?php

/**
 * This is the model class for table "blog_comments".
 *
 * The followings are the available columns in table 'blog_comments':
 * @property string $cid
 * @property integer $blogid
 * @property string $date
 * @property string $authorid
 * @property string $text
 * @property integer $approved
 * @property string $postingip
 */
class Comment extends DTActiveRecord
{
    const APPROVED_PUBLISHED = 2;
    const APPROVED_NONE = 0;

    /**
     * Returns the static model of the specified AR class.
     * @param string $className
     * @return Comment the static model class
     */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'blog_comments';
	}

        
        public function rules()
        {
            return array
            (
                array('text, blogid', 'required'),
                array('blogid', 'numerical', 'min' => 0)
            );
        }

        
	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
            return array(
				'Article' => array(self::BELONGS_TO, 'Article', 'blogid'),
                'CommentAuthor' => array(self::BELONGS_TO, 'User', 'authorid')
            );
	}


    /**
     * fetches the last X comments
     * @param int $limit how many comments to fetch
     * @return $this
     */
	public function RecentComments($limit = 8)
	{
		$this->getDbCriteria() ->mergeWith
		(
			array
			(
				'with' => array
				(
					'CommentAuthor' => array('select' => 'login, email'),
					'Article' => array('select' => 'title, url', 'condition' => 'blog.id is not null')
				),
				'order' => 'date DESC',
				'limit' => $limit
			)  
		);
		return  $this;
	}
}