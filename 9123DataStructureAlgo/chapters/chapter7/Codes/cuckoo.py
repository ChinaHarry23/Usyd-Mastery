from typing import Generic, List, TypeVar, Tuple

T = TypeVar('T')

"""
Hashmap - Cuckoo Hashing
----------

This class implements a hashmap using Cuckoo Hashing.
Recall that Cuckoo Hashing uses two lookup tables, _t_1 and _t_2 (of the same capacity), 
alongside two hash functions, h_1 and h_2, for _t_1 and _t_2 respectively. 
For more details, consult the lecture materials or ask on Ed.

Keys are guaranteed to be integers while values can be of any arbitrary specified type.

The following functions are available:
    - h_1: Hashes a given key to an index in the range [0, capacity) 
    - h_2: Hashes a given key to an index in the range [0, capacity)
    - put: Inserts a key-value pair into the hashmap
    - get: Retrieves the value associated with a given key
    - remove: Removes a key-value pair from the hashmap
    - size: Returns the number of key-value pairs in the hashmap
    - capacity: Returns the capacity of the hashmap
    - is_empty: Checks if the hashmap is empty
    - entries: Returns a list of all key-value pairs in the hashmap
"""


class Cuckoo(Generic[T]):
    _size: int  # The number of key-value pairs in the map.
    _capacity: int  # The maximum size of the table
    _t_1: List[Tuple[int, T]]  # table 1 with entries
    _t_2: List[Tuple[int, T]]  # table 2 with entries

    def __init__(self, capacity: int):
        """
        Constructor for the hashmap. 
        Initializes the map with the given capacity.
        All elements in the list are initialized to None. 

        :param capacity: The capacity of the hashmap.
        """
        self._size = 0
        self._capacity = capacity

        # Fill the table with empty lists of the given capacity.
        self._t_1 = [None for i in range(capacity)]
        self._t_2 = [None for i in range(capacity)]

    def h_1(self, key: int) -> int:
        """
        Hashes a key to an index in the table.

        Note, you should call this function in your put, get and remove method
        rather than using the key value directly. This is to ensure that the key
        value is always an integer between 0 <= hash(key) < capacity.

        This function is provided for you. DO NOT EDIT IT.

        :param key: The key to hash.
        :return: The index in the table.
        """
        return key % self._capacity

    def h_2(self, key: int) -> int:
        """
        Hashes a key to an index in the table.

        Note, you should call this function in your put, get and remove method
        rather than using the key value directly. This is to ensure that the key
        value is always an integer between 0 <= hash(key) < capacity.

        This function is provided for you. DO NOT EDIT IT.

        :param key: The key to hash.
        :return: The index in the table.
        """
        return ((key + 1) % self._capacity)

    def entries(self) -> List[Tuple[int, T]]:
        """
        Returns a list of all key-value pairs in the map.

        :return: A list of all key-value pairs in the map.
        """
        # TODO

    def put(self, key: int, value: T) -> None:
        """
        Puts a key-value pair in the hashmap.
        If the key already exists, the value is updated and the old value is returned. 
        Otherwise, the value is inserted into the map and None is returned.

        :param key: The key to put.
        :param value: The value to put.
        """

        # TODO

    def get(self, key: int) -> T:
        """
        Gets the value associated with the given key.
        If the key does not exist, None is returned.
        Otherwise, returns the value associated with the key.

        :param key: The key to get.
        :return: The value associated with the key or None.
        """

        # TODO

    def remove(self, key: int) -> T:
        """
        Removes the key-value pair associated with the given key.
        If the key does not exist, None is returned.
        Otherwise, returns the value associated with the key.

        :param key: The key to remove.
        :return: The value associated with the key or None.
        """
        # TODO

    def size(self) -> int:
        """
        Returns the number of key-value pairs in the map.

        :return: The number of key-value pairs in the map.
        """
        
        # TODO

    def capacity(self) -> int:
        """
        Returns the capacity of the map.

        :return: The capacity of the map.
        """

        # TODO
    
    def is_empty(self) -> bool:
        """
        Returns True if the map is empty.

        :return: Boolean indicating if the map is empty.
        """
        # TODO

