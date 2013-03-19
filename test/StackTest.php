<?php
/**
 * Created by JetBrains PhpStorm.
 * User: brianjeppesen
 * Date: 3/19/13
 * Time: 2:50 PM
 * To change this template use File | Settings | File Templates.
 */

namespace AmaroJeppesens\WebBase\Test;


class StackTest extends \PHPUnit_Framework_TestCase {
	public function testPushAndPop() {
		$stack = array();
		$this->assertEquals(0, count($stack));

		array_push($stack, 'foo');
		$this->assertEquals('foo', $stack[count($stack)-1]);
		$this->assertEquals(1, count($stack));

		$this->assertEquals('foo', array_pop($stack));
		$this->assertEquals(0, count($stack));
	}
}