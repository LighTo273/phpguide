<?php
/** @var $articles Article[] */
/** @var $showFullPosts bool */
?><?='<?'?>xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>

    <title>בלוג ה-phpguide</title>
    <link><?=bu(null, true)?></link>
    <description><![CDATA[מדריך, חדשות, עדכונים ופרסומים בעולם ה-php]]></description>
    <language>he-IL</language>
    <managingEditor><?=Yii::app()->params['adminEmail']?></managingEditor>

    <generator><?=bu(null, true)?></generator>
    <pubDate><?=$articles[0]->pub_date->date2rfc()?></pubDate>
    <lastBuildDate><?=$articles[0]->pub_date->date2rfc()?></lastBuildDate>


    <?php /** @var $item Article */
    foreach( $articles as $item ): ?>
        <item>
            <title><![CDATA[<?=e($item->title)?>]]></title>
            <guid><?=e(bu(urlencode($item->url . '.htm'), true))?></guid>
            <link><?=e(bu(urlencode($item->url . '.htm'), true))?></link>
            <description><![CDATA[
                <div dir='rtl'>
                    <table>
                        <tr>
                            <td valign="top"><img src="<?=e($item->image)?>" alt="image"/></td>
                            <td width="20"></td>
                            <td valign="top"> <?= $item->html_desc_paragraph .  ($showFullPosts ? $item->html_content : '') ?> </td>
                        </tr>
                    </table>

                </div>]]></description>
            <pubDate><?=$item->pub_date->date2rfc()?></pubDate>
            <category><?=bu(null, true)?></category>
        </item>
    <?php endforeach; ?>


</channel>
</rss>