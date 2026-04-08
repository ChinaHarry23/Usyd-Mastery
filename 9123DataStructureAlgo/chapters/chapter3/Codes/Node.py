"""
Singly Linked List Node
----------

This node represents an item in a singly linked list. 
Each node contains a value and a link to the next node. 
It supports operations to set and get its element as well as 
operations to set and get the element it is linked to.
"""

from typing import Generic, TypeVar

T = TypeVar('T')


class Node(Generic[T]):
   

    def __init__(self, value: T, next: 'Node[T]' = None) -> None:
        """
        The initialisation of the node sets the value held by the node
        as well as the element it is linked to.
        :param value: The value of the node.
        :param next: The next element after the node.
        """
        self._value = value
        self._next = next

    def get_value(self) -> T:
        """
        Getter method for the value of the node
        :return: The value of the node.
        """

        # TODO implement me.

    def set_value(self, value: T) -> None:
        """
        Setter method for the value of the node
        :param value: The value to set the node to.
        """

        # TODO implement me.

    def get_next(self) -> 'Node[T]':
        """
        Returns the next node linked to the current node.
        :return: Node which follows this given node.
        """

        # TODO implement me.

    def set_next(self, next: 'Node[T]') -> None:
        """
        Sets the next node linked to the current node.
        :param next: The node that comes after the current one.
        """

        # TODO implement me.

