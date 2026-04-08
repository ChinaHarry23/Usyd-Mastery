"""
Priority Queue ADT

Sorted-List Implementation.
Sort list items from smallest key to largest key. 

Fill out the empty functions.
-------

"""

from typing import List
from item import Item

class PriorityQueue():

    _sorted_list: List[Item]

    def __init__(self) -> None:
        self._sorted_list = []

    def size(self) -> int:
        """
        Return how many items are stored. 
        :return: Count of items stored.
        """

        # TODO

    def is_empty(self) -> bool:
        """
        Test if queue is empty
        :return: True if queue is empty, else False. 
        """

        # TODO

    def insert(self, k: int, v: str) -> None: 
        """
        Create and insert an item with key k and value v.
        If either k or v is None, return None.
        :param k: Key 
        :param v: Value 
        """

        # TODO

    def remove_min(self):
        """
        Remove and return the item with smallest key. 
        Return None if the list is empty. 
        :return: Return the item with smallest key.
        """  

        # TODO
        
    def min(self) -> Item:
        """
        Return item with smallest key.
        Return None if list is empty.
        :return: Item with smallest key
        """
        
        # TODO

