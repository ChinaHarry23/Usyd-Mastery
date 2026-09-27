from typing import Generic, List, TypeVar, Tuple
from defunct import Defunct

T = TypeVar('T')
"""
Hashmap - Open Addressing (Linear Probing)

This class implements a hashmap using open addressing. You will be using linear probing to do this.

Keys are guaranteed to be integers while values can be of any arbitrary specified type.

The following functions are available:
    - hash: Hashes a given key to an index in the range [0, capacity)
    - put: Inserts a key-value pair into the hashmap
    - get: Retrieves the value associated with a given key
    - remove: Removes a key-value pair from the hashmap
    - size: Returns the number of key-value pairs in the hashmap
    - capacity: Returns the capacity of the hashmap
    - is_empty: Checks if the hashmap is empty
    - entries: Returns a list of all key-value pairs in the hashmap
    - keys: Returns a list of all keys in the hashmap
    - values: Returns a list of all values in the hashmap

You do NOT have to account for load factors and table resizing.
"""

class OpenAddressing(Generic[T]):
    _size: int  # The number of key-value pairs in the map.
    _capacity: int  # The maximum size of the underlying table
    _table: List[List[Tuple[int, T]]]  # The underlying table with the entries

    def __init__(self, capacity: int):
        """
        Constructor for the hashmap. 
        Initializes the map with the given capacity. The capacity cannot be
        None or a negative number.

        :param capacity: The capacity of the hashmap.
        """
        if (capacity is None) or (capacity < 0):
            return None
        self._size = 0
        self._capacity = capacity
        self._defunct_marker = Defunct()

        # Fill the table with empty lists of the given capacity.
        self._table = [[] for i in range(capacity)]

    def hash(self, key: int) -> int:
        """
        Hashes a key to an index in the table.

        Note, you should call this function in your put, get and remove method
        rather than using the key value directly. This is to ensure that the key
        value is always an integer between 0 <= hash(key) < capacity.

        This function is provided for you. DO NOT EDIT IT.

        :param key: The key to hash.
        :return: The index in the table.
        """

        if key is None:
            return None

        return key % self._capacity

    def put(self, key: int, value: T) -> int:
        """
        Puts a key-value pair in the hashmap.
        
        Search as in get, but remember the first cell (index j) that we find 
        that has DEFUNCT or is empty. If we find the key, replace the value
        with this given value and return previous value. 

        :param key: The key to put.
        :param value: The value to put.
        :return: if a previous key/value pair was replaced, return its value. 
         In all other cases (including invalid parameters or if table is full), 
         return None.
        """
        # TODO


    def get(self, key: int) -> T:
        """
        Gets the value associated with the given key.
        Pass over cells with DEFUNCT and keep probing until element is found
        or an empty cell is reached
        :param key: The key to get.
        :return: The value associated with the key or None if key is not found/invalid.
        """
        # TODO
        
    def remove(self, key: int) -> T:
        """
        Removes the key-value pair associated with the given key.
        If the key is not found, None is returned.
        Otherwise, returns the value associated with the key and replace the 
        entry with the DEFUNCT object.

        :param key: The key to remove.
        :return: The value associated with the key or None if an invalid key
         was supplied or cannot be found.
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
        Returns True if the map is empty and false otherwise
        :return: Boolean indicating if the map is empty.
        """
        # TODO
        

    def entries(self) -> List[Tuple[int, T]]:
        """
        Returns a list of all key-value pairs in the map.
        :return: A list of all key-value pairs in the map.
        """
        # TODO
    
    def keys(self) -> List[T]:
        """
        Returns a list of all keys in the map
        :return: A list of all keys in the map
        """
        # TODO  
    
    def values(self) -> List[int]:
        """
        Returns a list of all values in the map
        :return: A list of all values in the map
        """
        # TODO
