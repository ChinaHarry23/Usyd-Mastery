from node import Node
from typing import Callable, Generic, TypeVar, List

T = TypeVar('T')
FuncT = TypeVar('FuncT', bound = Callable[[T, T], bool])

"""
AVL Tree
------

This is the AVL tree file which is the main data structure for this lesson. The AVL tree
contains a root node and each node can have at most two children. Additionally, the 
subtree height of any internal node's two children differs by at most 1.

Your task is to implement the basic functions below.

You may create helper functions if needed.

"""

class AVL(Generic[T]):
    _size: int
    _root: Node[T]
    _comparator: FuncT      # self._comparator(a, b) returns True if a < b
                            # based on some comparison criteria  
    """
    AVL Tree Class
    Holds nodes, which can have a left and right child, unless it is a leaf node, 
    then it has 0 children. Leaf nodes do not have values associated with them.
    
    Each node in the AVL Tree is type <class Node> as defined in 'node.py'
    -init: sets up tree with specified root node
    -get_size: get the size of the tree
    -get_root: returns root node
    -is_empty: check if tree is empty
    -is_leaf: check if node is leaf
    -restructure: performs a trinode restructure to restore balance following insertion/deletion
    -insert: add a given node to the tree, arranging it based on a specified criteria
    -remove: remove node with a given value from the tree
    -range_search: find all nodes that fit an upper and lower bound criteria
    -preorder: preorder traversal of tree
    -postorder: postorder traversal of tree

    """

    def __init__(self, root: 'Node[T]', comparator: FuncT) -> None:
        """
        Initialise the Tree
        :param root: Root node of the tree
        :param comparator: a binary function that is used for AVL comparisons/sorting
        """
        # TODO

    def get_size(self) -> int:
        """
        Return the size of the tree (number of nodes)
        :return: Integer that is the size of the avl tree
        """
        # TODO

    def get_root(self) -> 'Node[T]':
        """
        Return the root of the tree, or None if there is no
        node set at the root
        :return: Node object which is the root of the tree
        """
        # TODO
        
    def set_root(self, r: 'Node[T]') -> None:
        """
        Set the new root of the AVL Tree.
        You may set None as the root.
        :param r: new root of the AVL tree
        """
        # TODO
        
    def is_empty(self) -> bool:
        """
        Check whether the AVL tree is empty or not
        :return: True if the tree is empty and False otherwise
        """
        # TODO 
        
    def is_leaf(self, p: 'Node[T]') -> bool:
        """
        Check whether the given node p is a leaf node. 
        Return False if the node is None.
        :param p: node to be checked
        :return: True if p is a leaf node, False otherwise
        """
        # TODO
    
    def restructure(self, p: 'Node[T]') -> 'Node[T]':
        """
        Performs a trinode restructuring after an insertion or deletion 
        to maintain the height requirement of the AVL tree
        Returns the root of the rebalanced subtree
        If p is not suitable for restructuring, return None
        :param p: a node that has both a parent and grandparent
        """
        # TODO

    def search(self, k: T, p: 'Node[T]') -> 'Node[T]':
        """
        Searches the AVL tree for a given node and return it if it exists. If not,
        return the leaf node reached via an AVL search.
        If p or k are None, return None
        :param k: the key to search for
        :param p: the node to begin the search at
        """
        # TODO

    def insert(self, k: T) -> None:
        """
        Given a key, create and add the corresponding node to tree
        Increase the size of the tree by 1 here as well
        If k is None, return None
        :param k: key value to be added
        """
        # TODO

    def remove(self, k: T) -> T:
        """
        Search for key k and remove the node with this key
        Return the key that gets removed
        If k cannot be found or is None, then return None
        :param k: Key value to remove
        """
        # TODO
                
    def range_search(self, lower: T, upper: T) -> List['T']:
        """
        Returns a list of nodes with values V that fall within 
        the range: lower <= V <= upper
        If the lower or upper values supplied are invalid, return None
        Hint: Make a helper function like in the lectures!
        :param lower: the lowerbound of the range query
        :param upper: the upperbound of the range query
        """
        # TODO

    def preorder(self, p: 'Node[T]', ls: List['T']) -> None:
        """
        Preorder traversal of the tree
        Ignore the dummy/sentinel nodes of the AVL Tree
        If either p or ls is None, return None
        :param p: the node to visit
        :param ls: list to contain the VALUE of each node in preorder
        """
        # TODO
    
    def postorder(self, p: 'Node[T]', ls: List['T']) -> None:
        """
        Postorder traversal of the tree
        Ignore the dummy/sentinel nodes of the AVL Tree
        If either p or ls is None, return None
        :param p: the node to visit
        :param ls: list to contain the VALUE of each node in postorder
        """
        # TODO
