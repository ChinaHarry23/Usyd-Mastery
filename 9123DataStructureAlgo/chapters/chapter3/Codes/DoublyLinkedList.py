from Node import Node
from typing import Generic, TypeVar

T = TypeVar('T')

"""
Doubly Linked List
----------

This class will represent your Doubly Linked List and will contain Nodes from the Node class which you have created.
It supports operations to get first and last element, get elements before and after a particular node, insert
nodes, remove a node, return the size of the doubly linked list and also check if list is empty.
"""


class DoublyLinkedList(Generic[T]):
    _size: int
    _front: Node[T]
    _back: Node[T]

    """
    DoublyLinkedList Class
    Holds nodes, where each node in the DoublyLinkedList has a next Node and a prev Node.
    If the node is the start node, prev should be None and vice versa for the end node.

    Each node in the tree is type <class Node>[T] defined in 'node.py'.
    """

    def __init__(self, front: Node[T] = None) -> None:
        """
        The initialisation of the DoublyLinkedList sets the first node of the structure 
        :param front: The first node of the doubly linked list.
        """
        self._size = 1 if front else 0
        self._front = front
        self._back = front

    def first(self) -> Node[T]:
        """
        Returns the first node in the doubly linked list
        :return: The node at the front of the list.
        """

        # TODO implement me.

    def last(self) -> Node[T]:
        """
        Returns the last node in the doubly linked list
        :return: The node at the back of the list.
        """

        # TODO implement me.

    def before(self, p: Node[T]) -> Node[T]:
        """
        Returns the node immediately before node p and returns None if there are no nodes prior.
        :param p: The node whose previous node we are after.
        :return: The node immediately prior to p or None if there are no nodes after.
        """

        # TODO implement me.

    def after(self, p: Node[T]) -> Node[T]:
        """
        Returns the node immediately after node p and returns None if there are no nodes after.
        :param p: The node to get the next node after.
        :return: The node immediately after p or None if there are no nodes after.
        """

        # TODO implement me.

    def insert_before(self, p: Node[T], e: Node[T]) -> None:
        """
        Inserts the node e immediately before the node p.
        If the list is empty and p is None, insert e at the front of the list.
        Otherwise, if the list is not empty and p is None, return None.
        :param p: The node we want to insert e before.
        :param e: The node to insert.
        """

        # TODO implement me.

    def insert_after(self, p: Node[T], e: Node[T]) -> None:
        """
        Inserts the node e immediately after the node p.
        If the list is empty and p is None, insert e at the front of the list.
        Otherwise, if the list is not empty and p is None, return None.
        :param p: The node we want to insert e after.
        :param e: The node to insert.
        """

        # TODO implement me.

    def remove(self, p: Node[T]) -> Node[T]:
        """
        Removes the node p from the doubly linked list and returns it.
        If p is not valid, return None.
        :param p: The position of the node remove.
        :return: The node that was removed.
        """

        # TODO implement me.

    def size(self) -> int:
        """
        Returns the size of the singly linked list
        :return: The size of the list.
        """

        # TODO implement me.

    def is_empty(self) -> bool:
        """
        Returns if the singly linked list is empty of not.
        :return: True if the list is empty, false otherwise.
        """

        # TODO implement me.
