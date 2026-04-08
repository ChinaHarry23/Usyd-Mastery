from typing import Generic, TypeVar, List

T = TypeVar('T')
"""
AVL Tree Node
----------

This node represents a node in an AVL Tree
Each node contains a value, a pointer to its parent and two children
Further, it tracks the height of the subtree rooted at that node
"""

class Node(Generic[T]):
    
    _value: T
    _parent: 'Node[T]'
    _left: 'Node[T]'
    _right: 'Node[T]'
    _subtree_height: int

    """
    Node Class
    -init: sets the basic information such as the value it holds and its height
    -get_value: retrieves value of node
    -set_value: sets value for node
    -get_height: returns the height of the node
    -set_height: manually sets the height of the node following reversal
    -get_parent: return parent of node
    -set_parent: sets another node as the parent of a node
    -get_left: returns left child
    -set_left: adds a left child to this node
    -get_right: returns right child  
    -set_right: sets a right child to this node
    -num_children: returns the number of children belonging to a node
    -is_internal: checks if node is non-leaf
    -is_external: checks if node is leaf
    -is_root: checks if node is root
    """

    def __init__(self, value: T) -> None:
        """
        The initialisation of the node sets the value held by the node
        as well as the elements it is linked to.
        :param value: The value of the node.
        :param parent: parent of the node.
        """
        self._value = value
        self._subtree_height = 0
        self._parent = None
        self._left = None
        self._right = None

    def get_value(self) -> T:
        """
        Getter method for the value of the node
        :return: The value of the node.
        """
        return self._value

    def set_value(self, value: T) -> None:
        """
        Setter method for the value of the node
        :param value: The value to set the node to.
        """
        self._value = value
    
    def get_height(self) -> int:
        """
        :return: the height of the node
        """
        return self._subtree_height
    
    def set_height(self, n: int) -> None:
        """
        Manually sets the height of a node
        :param n: the new height
        """
        self._subtree_height = n

    def get_parent(self) -> 'Node[T]':
        """
        Returns the parent of the node.
        :return: Node which is the parent of the given node
        """
        return self._parent
    
    def set_parent(self, p: 'Node[T]') -> None:
        """
        Set parent of current node to given node
        :param p: Node to be new parent
        """
        self._parent = p
    
    def get_left(self) -> 'Node[T]':
        """
        Returns the left child of the node.
        :return: Node which is the left child of the given node
        """
        return self._left

    def set_left(self, child: 'Node[T]') -> None:
        """
        Adds a node as the left child to the current node. 
        This method should also update the height of the subtree
        rooted at this node, as well as all its ancestors 
        Do not increment the height here
        :param child: the node to be set as the left child.
        """
        self._left = child
        child._parent = self
      
    def get_right(self) -> 'Node[T]':
        """
        Returns the right child of the node.
        :return: Node which is the right child of the given node
        """
        return self._right
    
    def set_right(self, child: 'Node[T]') -> None:
        """
        Adds a node as the right child to the current node. 
        This method should also update the height of the subtree
        rooted at this node, as well as all its ancestors
        Do not increment the height here
        :param child: the node to be set as the right child.
        """
        self._right = child
        child._parent = self

    def num_children(self) -> int:
        """
        :return: The number of direct children belonging
        to the current node.
        """
        n = 0
        if self._left != None:
            n += 1
        if self._right != None:
            n += 1
        return n

    def is_internal(p: 'Node[T]') -> bool:
        """
        Checks if a specified node is an internal node.
        :param p: The given node
        :return: true if node is internal and false otherwise
        """
        return p.get_value() != None
        
    def is_external(p: 'Node[T]') -> bool:
        """
        Checks if a specified node is an external node.
        :param p: The given node
        :return: true if node is external and false otherwise
        """
        return p.get_value() == None

    def is_root(p: 'Node[T]') -> bool:
        """
        Checks if a specified node is the root of an AVL tree.
        :param p: The given node
        :return: true if node is root and false otherwise
        """
        return p._parent == None