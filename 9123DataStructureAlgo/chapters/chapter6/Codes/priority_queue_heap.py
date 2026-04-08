"""
Priority Queue ADT

(Binary Tree) Heap based Implementation.

Fill out the empty functions.
-------

"""

from node import Node
from typing import List

class PriorityQueue():

    _root: Node
    _last: Node
    _size: int

    def __init__(self) -> None:
        """
        Initialises a priority queue. 
        """
        self._root = None
        self._last = None
        self._size = 0

    def size(self) -> int:
        """
        Return how many Nodes are stored. 
        :return: Count of nodes stored.
        """

        # TODO implement me.  

    def is_empty(self) -> bool:
        """
        Test if queue is empty
        :return: True if queue is empty, else False. 
        """
        
        # TODO implement me.  

    def insert(self, k: int, v: str) -> None: 
        """
        Create and insert Node with key k and value v.
        If either k or v is None, return None.
        :param k: Key 
        :param v: Value 
        """

        # TODO implement me.  

    def remove_min(self) -> Node:
        """
        Remove and return the node with smallest key. 
        Return None if the heap is empty. 
        :return: Return the node with smallest key.
        """  
        
        # TODO implement me.  
        
    def min(self) -> Node:
        """
        Return node with smallest key.
        Return None if list is empty.
        :return: Node with smallest key
        """  

        # TODO implement me.  

