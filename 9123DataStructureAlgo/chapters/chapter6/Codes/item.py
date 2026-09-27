"""
Items storing key-value pairs.
-------

There is no need to touch this file. 

"""

class Item():
    _key: int
    _value: str

    def __init__(self, key: int, value: str) -> None:
        """
        Initialises an item containing a key-value pair.
        :param key: Integer key to be stored in the Item object. 
        :param value: String value to be stored in the Item object.
        """
        
        self._key = key
        self._value = value

    def get_key(self) -> int:
        """
        Returns the associated key stored within the item.
        :return: Integer key stored within the item.
        """
        return self._key

    def get_value(self) -> str:
        """
        Returns the associated value stored within the item.
        :return: String value stored within the item.
        """
        return self._value
