"""
Tree Node
----------

This node represents a node in a Tree
Each node contains a value, a key, a pointer to its parent, a pointer to left child and a pointer to right child.

You must complete the up_heap() and down_heap() function in this file. 
The other functions have been done for you. 

"""

class Node():
    _key: int
    _value: str
    _parent: 'Node'
    _left_child: 'Node'
    _right_child: 'Node'

    """
    Node Class
    -init: Sets the basic information such as the value it holds and next element
    -get_key: retrieves value of node
    -set_key: sets key for node
    -get_value: retrieves value of node
    -set_value: sets value for node
    -get_parent: return parent of node
    -add_left_child: Sets the child node to the left child attribute of the current node
    -add_right_child: Sets the child node to the right child attribute of the current node
    -get_left_child: Return the left child
    -get_right_child: Return the right child
    -is_root: checks if node is root
    -up_heap: Restore heap-order property by swapping keys along upward path from insertion point
    -down_heap: Restore heap-order property by swapping keys along downward path from the root
    """

    def __init__(self, key: int, value: str) -> None:
        """
        The initialisation of the node sets the value held by the node
        as well as the element it is linked to.
        :param key: key stored in node 
        :param value: value stored in node.
        """
        self._key = key
        self._value = value
        self._parent = None
        self._right_child = None
        self._left_child = None

    def get_key(self) -> int: 
        """
        Getter method for the key of the node
        :return: The key of the node.
        """
        return self._key

    def set_key(self, key: int) -> None:
        """
        Setter method for the key of the node
        :param value: The key to set the node to.
        """
        self._key = key

    def set_value(self, value: str) -> None: 
        """
        Setter method for the value of the node
        :param value: The value to set the node to.
        """
        self._value = value
    
    def get_value(self) -> str: 
        """
        Getter method for the value of the node
        :return: The value of the node.
        """
        return self._value

    def get_parent(self) -> 'Node':
        """
        Returns the parent of the node.
        :return: Node which is the parent of the given node
        """
        return self._parent
    
    def add_left_child(self, child: 'Node') -> None:
        """
        Sets the _left_child attribute of the node to child.
        If child is None, set the node's left child as None. 
        :param child: The child node to be added.
        """
        if child == None:
            self._left_child = None
            return
        self._left_child = child
        child._parent = self
    
    def add_right_child(self, child: 'Node') -> None:
        """
        Sets the _right_child attribute of the node to child.
        If child is None, set the node's right child as None.
        :param child: The child node to be added. 
        """
        if child == None:
            self._right_child = None
            return
        self._right_child = child
        child._parent = self
    
    def get_left_child(self) -> 'Node':
        """
        Returns the left child of the current node.
        :return: The left child of the current node.
        """
        return self._left_child

    def get_right_child(self) -> 'Node':
        """
        Returns the right child of the current node.
        :return: The right child of the current node.
        """
        return self._right_child

    def is_root(self) -> bool: 
        """
        Returns True if node is root and false otherwise 
        :return: Boolean value for whether the node is the root.
        """
        return self._parent == None
        
    def up_heap(self) -> None:
        """
        Performs up-heap operation, starting on the node object that this function is called on.
        """

        # TODO implement me.         

    def down_heap(self) -> None:
        """
        Performs down-heap operation, starting on the node object that this function is called on.
        """

        # TODO implement me.           

